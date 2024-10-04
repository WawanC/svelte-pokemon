import type { PageLoad } from './$types';
import { getPokemons } from '$lib/services/pokemon';

export const load: PageLoad = async ({ url, depends }) => {
	const searchParams = url.searchParams;

	const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1;

	const pokemons = await getPokemons(page);

	return {
		pokemons: pokemons,
		page: page
	};
};
