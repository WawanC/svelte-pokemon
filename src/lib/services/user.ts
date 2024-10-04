import { doc, getDoc, setDoc } from 'firebase/firestore';
import { firestore } from '$lib/utils/firebase';
import { userStore } from '$lib/stores/auth';
import { getPokeballTimeLeft } from '$lib/utils/user';
import { MAX_POKEBALLS_COUNT } from '$lib/constants/user';
import { getPokemon } from '$lib/services/pokemon';
import type { OwnPokemon } from '../../types/pokemon';

export const addPokeball = async (userId: string, count: number) => {
	const data = await getDoc(doc(firestore, 'users', userId));
	const pokeballsCount: number = data.get('pokeballsCount');
	const updatedPokeballsCount = Math.min(pokeballsCount + count, MAX_POKEBALLS_COUNT);

	await setDoc(doc(firestore, 'users', userId), {
		...data.data(),
		pokeballsCount: updatedPokeballsCount,
		lastSession: new Date().toISOString()
	});

	userStore.update((store) => {
		if (!store) return store;

		return {
			...store,
			pokeballsCount: updatedPokeballsCount,
			pokeballTimeLeft: getPokeballTimeLeft(new Date().toISOString())
		};
	});

	return updatedPokeballsCount;
};

export const getPokemonCollections = async (userId: string) => {
	const data = await getDoc(doc(firestore, 'users', userId));
	const pokemons = data.get('pokemons');

	if (!pokemons) return [];

	const ownPokemons: OwnPokemon[] = [];
	for (const [name, level] of Object.entries(pokemons)) {
		const pokemon = await getPokemon(name);

		if (pokemon) {
			const ownPokemon: OwnPokemon = {
				pokemon: pokemon,
				level: Number(level)
			};
			ownPokemons.push(ownPokemon);
		}
	}

	return ownPokemons;
};

export const syncPokemonCollections = async (userId: string) => {
	const ownPokemons = await getPokemonCollections(userId);

	userStore.update((store) => {
		if (!store) return store;

		return {
			...store,
			ownPokemons: ownPokemons
		};
	});
};

export const getOwnedPokemon = async (pokemonName: string, userId: string) => {
	const result = await getDoc(doc(firestore, 'users', userId));
	const ownedPokemonLevel = result.get(`pokemons.${pokemonName}`);

	if (!ownedPokemonLevel) return null;
	return ownedPokemonLevel as number;
};
