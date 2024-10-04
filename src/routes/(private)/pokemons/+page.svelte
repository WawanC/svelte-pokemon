<script lang="ts">
	import type { PageData } from './$types';
	import Icon from '@iconify/svelte';
	import PokemonCard from '$lib/components/PokemonCard.svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { getOwnedPokemon } from '$lib/services/user';
	import { userStore } from '$lib/stores/auth';

	const movePage = (pageDest: number) => {
		const url = new URL($page.url);
		const searchParams = url.searchParams;

		searchParams.set('page', pageDest.toString());
		goto('?' + searchParams.toString(), {
			keepFocus: true
		});
	};

	$:  {
		if (userId)
			fetchOwnedPokemons(userId);
	}

	const fetchOwnedPokemons = async (userId: string) => {
		if (!userId) return;
		isLoading = true;
		for (const [pokemon] of data.pokemons.entries()) {
			const result = await getOwnedPokemon(pokemon.name, userId);
			if (result) {
				pokemon.isOwned = true;
				pokemon.ownedLevel = result;
			}
		}
		isLoading = false;
	};

	export let data: PageData;
	$: pokemons = data.pokemons;
	$: pageNumber = data.page;
	$: userId = $userStore?.user?.uid;
	let isLoading = false;
</script>

<main class="flex flex-col items-center p-4 gap-8">
	<a
		class="flex gap-1 items-center bg-accent px-3 py-2 rounded shadow text-white"
		href="/dashboard">
		<Icon class="text-xl" icon="ep:back" />
		<span>Back</span>
	</a>

	<h1 class="text-4xl font-bold">Browse Pokemons</h1>
	<section class="flex flex-col gap-4 items-center">
		<ul class="flex flex-wrap justify-center gap-2">
			{#each pokemons as pokemon(pokemon.name)}
				<PokemonCard pokemon={pokemon} />
			{/each}
		</ul>
		<div class="flex gap-8 items-center mt-4">
			<button class="px-4 py-2 bg-accent rounded" on:click={() => movePage(pageNumber - 1)}>Prev</button>
			<span class="text-2xl">{pageNumber}</span>
			<button class="px-4 py-2 bg-accent rounded" on:click={() => movePage(pageNumber + 1)}>Next</button>
		</div>
	</section>
</main>