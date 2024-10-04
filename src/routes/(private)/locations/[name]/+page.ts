import type { PageLoad } from './$types';
import { getPokemonLocation } from '$lib/services/pokemon';
import { redirect } from '@sveltejs/kit';

export const load: PageLoad = async ({ params }) => {
	const locationName = params.name;
	await new Promise((resolve) => setTimeout(() => resolve(true), 2000));
	const location = await getPokemonLocation(locationName);

	if (!location) {
		return redirect(300, '/not-found');
	}

	return {
		location
	};
};
