import type { PageLoad } from './$types';
import { getPokemon } from '$lib/services/pokemon';
import { redirect } from '@sveltejs/kit';

export const load: PageLoad = async ({ params, depends }) => {
	const pokemonName = params.name;

	const pokemon = await getPokemon(pokemonName, { withLocations: true });

	if (!pokemon) {
		redirect(300, '/not-found');
	}

	return {
		pokemon
	};
};
