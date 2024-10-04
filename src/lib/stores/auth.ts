import { writable } from 'svelte/store';
import type { User } from 'firebase/auth';
import { trackAuthState } from '$lib/services/auth';
import type { OwnPokemon } from '../../types/pokemon';

export type UserStore = {
	user: User | null;
	username: string | null;
	email: string | null;
	pokeballsCount: number;
	lastSession: string | null;
	pokeballTimeLeft: number | null;
	ownPokemons: OwnPokemon[] | null;
	isLoaded: boolean;
} | null;

export const userStore = writable<UserStore>({
	user: null,
	username: null,
	email: null,
	pokeballsCount: 0,
	lastSession: null,
	pokeballTimeLeft: null,
	ownPokemons: null,
	isLoaded: false
});

trackAuthState((user) => {
	userStore.set(user);
});
