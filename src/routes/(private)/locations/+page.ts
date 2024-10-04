import type { PageLoad } from './$types';
import { getPokemonLocations } from '$lib/services/pokemon';

export const load: PageLoad = async ({ url, depends }) => {
	const searchParams = url.searchParams;

	const pokemonLocations = await getPokemonLocations({
		filter: {
			name: searchParams.get('location_name') ?? undefined
		}
	});

	return {
		locations: pokemonLocations
	};
};
