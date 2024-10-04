export type PokemonLocation = {
	id: number;
	name: string;
	url: string;
	originalName: string;
};

export type PokemonLocationDetail = {
	name: string;
	originalName: string;
	encounters: Pokemon[];
};

export type PokemonLocationApiResponse = {
	id: number;
	name: string;
	location: {
		name: string;
		url: string;
	};
	pokemon_encounters: {
		pokemon: {
			name: string;
		};
		version_details: {
			encounter_details: {
				chance: number;
				max_level: number;
			}[];
		}[];
	}[];
};

export type LocationAreaApiResponse = {
	location_area: {
		name: string;
		url: string;
	};
}[];

export type Pokemon = {
	id: number;
	name: string;
	types: string[];
	sprite: {
		front: string;
		back: string;
	};
	encounter?: {
		max_level: number;
		chance: number;
	};
	isOwned: boolean;
	ownedLevel: number | null;
	locations?: string[];
};

export type OwnPokemon = {
	pokemon: Pokemon;
	level: number;
};
