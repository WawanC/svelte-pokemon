export const transformPokemonLocationName = (name: string) => {
	return name
		.split('-')
		.map((word) => {
			return word.charAt(0).toUpperCase() + word.substring(1);
		})
		.join(' ');
};

export const getPokemonTypeLogoImage = (type: string) => {
	const allowedTypes = [
		'bug',
		'dark',
		'dragon',
		'electric',
		'fairy',
		'fighting',
		'fire',
		'flying',
		'ghost',
		'grass',
		'ground',
		'ice',
		'normal',
		'poison',
		'psychic',
		'rock',
		'steel',
		'water'
	];

	if (!allowedTypes.includes(type)) {
		return `/images/types/unknown.png`;
	}
	return `/images/types/${type}.png`;
};
