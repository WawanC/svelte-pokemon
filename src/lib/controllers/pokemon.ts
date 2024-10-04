import type { Pokemon } from '../../types/pokemon';
import { catchPokemon, storePokemon } from '$lib/services/pokemon';
import { syncPokemonCollections } from '$lib/services/user';

export const handleCatchPokemon = async (pokemon: Pokemon, userId: string) => {
	try {
		const result = await catchPokemon(pokemon, userId);

		if (result && result > 0) {
			await storePokemon(pokemon, result, userId);

			await syncPokemonCollections(userId);

			return {
				success: true,
				isCatched: true,
				pokemon: pokemon,
				level: result
			};
		} else {
			return {
				success: true,
				isCatched: false
			};
		}
	} catch (error) {
		let err = error as Error;
		return {
			success: false,
			message: err.message
		};
	}
};
