import { graphql } from '../../../graphql';

export const POKEMON_LOCATIONS_QUERY = graphql(`
	query PokemonLocationsQuery {
		locations {
			results {
				id
				url
				name
			}
		}
	}
`);

export const POKEMON_LOCATION_QUERY = graphql(`
	query PokemonLocationQuery($locationName: String!) {
		location(location: $locationName) {
			response
		}
	}
`);

export const POKEMONS_QUERY = graphql(`
	query PokemonsQuery($limit: Int, $offset: Int) {
		pokemons(limit: $limit, offset: $offset) {
			results {
				url
				name
				image
			}
			count
		}
	}
`);

export const POKEMON_QUERY = graphql(`
	query PokemonQuery($pokemonName: String!) {
		pokemon(name: $pokemonName) {
			id
			name
			types {
				type {
					name
				}
			}
			sprites {
				back_default
				front_default
			}
		}
	}
`);
