<main class="flex flex-col gap-8 p-8 items-center">
	<a
		class="flex gap-1 items-center bg-accent px-3 py-2 rounded shadow text-white"
		href="/locations">
		<Icon class="text-xl" icon="ep:back" />
		<span>Back</span>
	</a>

	<h1 class="font-bold text-2xl">{pokemonLocation.name}</h1>
	{#if isLoading}
		<img src="{base}/images/pokeball.png" class="w-24 animate-spin grayscale" alt="owned-loading">
	{:else}
		<ul class="flex flex-wrap justify-center gap-2 w-full">
			{#each pokemonLocation.encounters as pokemon(pokemon.id)}
				<LocationPokemonCard pokemon={pokemon} catchPokemonHandler={catchPokemon} />
			{/each}
		</ul>
	{/if}
</main>

<script lang="ts">
	import type { PageData } from './$types';
	import type { Pokemon } from '../../../../types/pokemon';
	import { userStore } from '$lib/stores/auth';
	import Icon from '@iconify/svelte';
	import { base } from '$app/paths';
	import { getOwnedPokemon } from '$lib/services/user';
	import LocationPokemonCard from '$lib/components/LocationPokemonCard.svelte';
	import { showToast } from '$lib/stores/toast';
	import { handleCatchPokemon } from '$lib/controllers/pokemon';

	const catchPokemon = async (pokemon: Pokemon) => {

		if (!$userStore?.user?.uid) return;

		const result = await handleCatchPokemon(pokemon, $userStore?.user.uid);

		if (result.success) {
			if (result.isCatched) {
				showToast({
					id: Math.random().toString(),
					title: `Success catch ${result.pokemon?.name} Lv.${result.level}`,
					type: 'success'
				});
			} else {
				showToast({
					id: Math.random().toString(),
					title: `Failed catch ${pokemon.name}`,
					type: 'failed'
				});
			}
		} else {
			if (result.message)
				showToast({
					id: Math.random().toString(),
					title: result.message,
					type: 'failed'
				});
		}
		await fetchOwnedPokemons($userStore.user.uid);
	};

	let isLoading = false;
	export let data: PageData;
	$: pokemonLocation = data.location;
	$: userId = $userStore?.user?.uid;

	$:  {
		if (userId)
			fetchOwnedPokemons(userId);
	}

	const fetchOwnedPokemons = async (userId: string) => {
		if (!userId) return;
		isLoading = true;
		for (const [idx, pokemon] of pokemonLocation.encounters.entries()) {
			const result = await getOwnedPokemon(pokemon.name, userId);
			if (result) {
				pokemonLocation.encounters[idx].isOwned = true;
				pokemonLocation.encounters[idx].ownedLevel = result;
			}
		}
		isLoading = false;
	};

</script>