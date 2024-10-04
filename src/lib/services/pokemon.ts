import apolloClient from '$lib/graphql/apollo';
import {
	POKEMON_LOCATION_QUERY,
	POKEMON_LOCATIONS_QUERY,
	POKEMON_QUERY,
	POKEMONS_QUERY
} from '$lib/graphql/queries/pokemon';
import type {
	LocationAreaApiResponse,
	Pokemon,
	PokemonLocation,
	PokemonLocationApiResponse,
	PokemonLocationDetail
} from '../../types/pokemon';
import { transformPokemonLocationName } from '$lib/utils/pokemon';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { firestore } from '$lib/utils/firebase';
import { userStore } from '$lib/stores/auth';
import { MAX_POKEBALLS_COUNT } from '$lib/constants/user';
import { getPokeballTimeLeft } from '$lib/utils/user';

export const getPokemonLocations = async (options?: { filter?: { name?: string } }) => {
	const results = await apolloClient.query({
		query: POKEMON_LOCATIONS_QUERY
	});
	if (results.error) {
		throw new Error(results.error.message);
	}
	const { locations } = results.data;

	if (!locations || !locations.results) {
		return [];
	}

	const locationsList: PokemonLocation[] = [];

	for (const location of locations.results) {
		if (!location || !location.name || !location.url || !location.id) continue;

		const locationName = transformPokemonLocationName(location.name);

		if (options?.filter) {
			if (options.filter.name) {
				const regex = new RegExp(options.filter.name, 'i');
				if (!regex.test(locationName)) continue;
			}
		}

		locationsList.push({
			id: location.id,
			name: locationName,
			url: location.url,
			originalName: location.name
		});
	}

	return locationsList;
};

export const getPokemonLocation = async (name: string) => {
	const result = await apolloClient.query({
		query: POKEMON_LOCATION_QUERY,
		variables: {
			locationName: name
		}
	});

	if (result.error) {
		throw new Error(result.error.message);
	}
	const { location } = result.data;
	if (!location) return null;
	const { response } = location;
	const apiUrl = response.areas[0]?.url ?? null;

	if (!apiUrl) return null;

	const apiResult = await fetch(apiUrl);
	const apiResponse = (await apiResult.json()) as PokemonLocationApiResponse;

	const locationDetail: PokemonLocationDetail = {
		name: transformPokemonLocationName(apiResponse.name),
		originalName: apiResponse.name,
		encounters: []
	};

	for (const encounter of apiResponse.pokemon_encounters) {
		const pokemon = await getPokemon(encounter.pokemon.name);

		if (pokemon) {
			pokemon.encounter = {
				chance: encounter.version_details[0].encounter_details[0].chance ?? 0,
				max_level: encounter.version_details[0].encounter_details[0].max_level ?? 0
			};
			locationDetail.encounters.push(pokemon);
		}
	}

	return locationDetail;
};

export const getPokemons = async (page: number) => {
	const perPage = 20;
	const results = await apolloClient.query({
		query: POKEMONS_QUERY,
		variables: {
			limit: perPage,
			offset: (page - 1) * perPage
		}
	});

	if (results.error) {
		throw new Error(results.error.message);
	}

	const { pokemons } = results.data;

	if (!pokemons?.results) return [];

	const listPokemon: Pokemon[] = [];

	for (const res of pokemons.results) {
		if (!res?.name) continue;

		const pokemon = await getPokemon(res.name);

		if (pokemon) listPokemon.push(pokemon);
	}

	return listPokemon;
};

export const getPokemon = async (
	name: string,
	options?: {
		withLocations?: boolean;
	}
) => {
	const result = await apolloClient.query({
		query: POKEMON_QUERY,
		variables: {
			pokemonName: name
		}
	});

	if (result.error) {
		throw new Error(result.error.message);
	}

	const { pokemon } = result.data;

	if (
		!pokemon ||
		!pokemon.id ||
		!pokemon.name ||
		!pokemon.sprites ||
		!pokemon.sprites.front_default ||
		!pokemon.sprites.back_default
	) {
		return null;
	}

	const types: string[] = [];
	for (const type of pokemon.types ?? []) {
		if (type?.type?.name) {
			types.push(type.type.name);
		}
	}

	const pokemonObj: Pokemon = {
		id: pokemon.id,
		name: pokemon.name,
		types: types,
		sprite: {
			front: pokemon.sprites.front_default,
			back: pokemon.sprites.back_default
		},
		isOwned: false,
		ownedLevel: null
	};

	if (options?.withLocations) {
		const locationResult = await fetch(
			`https://pokeapi.co/api/v2/pokemon/${pokemon.name}/encounters`
		);
		const locations = (await locationResult.json()) as LocationAreaApiResponse;
		const pokemonLocations: string[] = [];
		for (const loc of locations) {
			const result = await fetch(loc.location_area.url);
			const json = (await result.json()) as PokemonLocationApiResponse;
			pokemonLocations.push(json.location.name);
		}
		pokemonObj.locations = pokemonLocations;
	}

	return pokemonObj;
};

export const catchPokemon = async (pokemon: Pokemon, userId: string) => {
	const maxLevel = pokemon.encounter?.max_level ?? 0;
	const chance = pokemon.encounter?.chance ?? 0;

	const userData = await getDoc(doc(firestore, 'users', userId));
	const pokeballsCount = userData.get('pokeballsCount') ?? 0;
	const lastSession = userData.get('lastSession');
	if (!pokeballsCount) {
		throw new Error('Not enough pokeball');
	}
	await updateDoc(doc(firestore, 'users', userId), {
		pokeballsCount: pokeballsCount - 1,
		lastSession: pokeballsCount === MAX_POKEBALLS_COUNT ? new Date().toISOString() : lastSession
	});

	userStore.update((store) => {
		if (!store) return store;
		return {
			...store,
			pokeballsCount: pokeballsCount - 1,
			pokeballTimeLeft: getPokeballTimeLeft(
				pokeballsCount === MAX_POKEBALLS_COUNT ? new Date().toISOString() : lastSession
			)
		};
	});

	const randomNumber = Math.floor(Math.random() * 100 + 1);
	const isCatch = randomNumber <= chance;
	if (!isCatch) return null;

	return Math.floor(Math.random() * maxLevel + 1);
};

export const storePokemon = async (pokemon: Pokemon, level: number, userId: string) => {
	const userData = await getDoc(doc(firestore, 'users', userId));

	const currentLevel = userData.get('pokemons.' + pokemon.name);
	const targetLevel = Math.min(currentLevel ? currentLevel + 1 : level, 100);

	await updateDoc(doc(firestore, 'users', userId), {
		['pokemons.' + pokemon.name]: targetLevel
	});
};
