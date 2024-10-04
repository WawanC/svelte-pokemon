<script lang="ts">
	import type { PageData } from './$types';
	import Icon from '@iconify/svelte';
	import { base } from '$app/paths';
	import { getPokemonTypeLogoImage, transformPokemonLocationName } from '$lib/utils/pokemon';
	import { getOwnedPokemon } from '$lib/services/user';
	import { userStore } from '$lib/stores/auth';

	export let data: PageData;
	$: pokemon = data.pokemon;
	$: userId = $userStore?.user?.uid;
	let isOwned = false;
	let ownedLevel = 0;

	$: if (userId) {
		fetchOwnedPokemon(userId);
	}

	const fetchOwnedPokemon = async (userId: string) => {
		const result = await getOwnedPokemon(pokemon.name, userId);
		if (result) {
			isOwned = true;
			ownedLevel = result;
		}
	};
</script>

<main class="flex flex-col items-center p-4 gap-32">
	<a
		class="flex gap-1 items-center bg-accent px-3 py-2 rounded shadow text-white"
		href="/pokemons">
		<Icon class="text-xl" icon="ep:back" />
		<span>Back</span>
	</a>
	<section class="flex w-3/4 bg-accent rounded-xl overflow-hidden shadow">
		<div class="w-1/2 aspect-square">
			<img
				alt="front-{pokemon.id}"
				class="w-full h-auto object-cover"
				src="{pokemon.sprite.front}"
			>
		</div>
		<div class="w-1/2 flex flex-col gap-4 p-8 justify-center items-center">
			<h1 class="text-center text-4xl font-bold">{pokemon.name}</h1>
			<div class="flex gap-2 justify-center">
				{#each pokemon.types as type(type)}
					<div class="w-full">
						<img
							src="{base}{getPokemonTypeLogoImage(type)}"
							alt="type-{pokemon.name}-{type}"
							class="w-24 h-auto scale-150"
						>
					</div>
				{/each}
			</div>
			{#if isOwned}
				<span class="px-4 py-2 bg-success rounded-full shadow">
					Owned Lv.{ownedLevel}
				</span>
			{/if}
			{#if pokemon.locations}
				<div class="flex flex-col items-center gap-2">
					<p class="text-xl font-bold">Locations :</p>
					{#if pokemon.locations.length > 0}
						<ul>
							{#each pokemon.locations as location, i(location + '-' + i)}
								<li>
									<a href="/locations/{location}" class="flex gap-2 items-center p-2 hover:underline">
										<Icon class="text-xl" icon="mdi:location" />
										<span>
										{transformPokemonLocationName(location)}
									</span>
									</a>
								</li>
							{/each}
						</ul>
					{:else}
						<p class="text-center">Unknown</p>
					{/if}
				</div>
			{/if}
		</div>
	</section>
</main>