import {
	createUserWithEmailAndPassword,
	onAuthStateChanged,
	signInWithEmailAndPassword,
	signOut,
	type User
} from 'firebase/auth';
import { firebaseAuth, firestore } from '$lib/utils/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { type UserStore } from '$lib/stores/auth';
import { getPokeballTimeLeft } from '$lib/utils/user';
import { MAX_POKEBALLS_COUNT, NEW_POKEBALL_TIMER } from '$lib/constants/user';
import { getPokemonCollections } from '$lib/services/user';

export const registerUser = async (username: string, email: string, password: string) => {
	try {
		const credential = await createUserWithEmailAndPassword(firebaseAuth, email, password);

		await setDoc(doc(firestore, 'users', credential.user.uid), {
			username: username,
			email: credential.user.email,
			pokeballsCount: 10,
			lastSession: new Date().toISOString()
		});
	} catch (error) {
		throw error;
	}
};

export const loginUser = async (email: string, password: string) => {
	try {
		const credential = await signInWithEmailAndPassword(firebaseAuth, email, password);
		return credential.user;
	} catch (error) {
		throw error;
	}
};

export const logoutUser = async () => {
	await signOut(firebaseAuth);
};

export const trackAuthState = (callback: (user: UserStore) => void) => {
	return onAuthStateChanged(
		firebaseAuth,
		async (user: User | null) => {
			const userStore: UserStore = {
				user: null,
				username: null,
				email: null,
				pokeballsCount: 0,
				lastSession: null,
				pokeballTimeLeft: null,
				ownPokemons: null,
				isLoaded: true
			};

			if (!user) return callback(userStore);

			userStore.user = user;
			userStore.email = user.email;

			if (user) {
				let response = await getDoc(doc(firestore, 'users', user.uid));
				const lastSessionISO = response.get('lastSession');
				let pokeballsCount = response.get('pokeballsCount');
				const username = response.get('username');

				let timeLeft = getPokeballTimeLeft(lastSessionISO);
				const lastSessionTime = new Date(lastSessionISO);

				if (timeLeft < 0) {
					const now = new Date();
					const generatedPokeballsCount = Math.floor(
						(now.getTime() - lastSessionTime.getTime()) / NEW_POKEBALL_TIMER
					);

					timeLeft = NEW_POKEBALL_TIMER + (timeLeft % NEW_POKEBALL_TIMER);

					const updatedLastSessionTime =
						lastSessionTime.getTime() + generatedPokeballsCount * NEW_POKEBALL_TIMER;
					const updatedLastSession = new Date(updatedLastSessionTime);
					pokeballsCount = Math.min(pokeballsCount + generatedPokeballsCount, MAX_POKEBALLS_COUNT);

					await updateDoc(doc(firestore, 'users', user.uid), {
						pokeballsCount: pokeballsCount,
						lastSession: updatedLastSession.toISOString()
					});
				}

				userStore.username = username;
				userStore.pokeballsCount = pokeballsCount;
				userStore.pokeballTimeLeft =
					pokeballsCount >= MAX_POKEBALLS_COUNT ? NEW_POKEBALL_TIMER : timeLeft;
				userStore.ownPokemons = await getPokemonCollections(user.uid);
			}

			callback(userStore);
		},
		(err) => {
			const userStore: UserStore = {
				user: null,
				username: null,
				email: null,
				pokeballsCount: 0,
				lastSession: null,
				pokeballTimeLeft: null,
				ownPokemons: null,
				isLoaded: true
			};

			callback(userStore);
		}
	);
};
