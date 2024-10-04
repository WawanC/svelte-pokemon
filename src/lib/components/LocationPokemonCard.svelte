<script lang="ts">
	import { base } from '$app/paths';
	import { getPokemonTypeLogoImage } from '$lib/utils/pokemon';
	import type { Pokemon } from '../../types/pokemon';

	export let pokemon: Pokemon;
	export let catchPokemonHandler: (pokemon: Pokemon) => Promise<void>;
</script>

<li class="relative p-2 w-[40%] lg:w-[12%] flex flex-col items-center gap-2 bg-accent rounded shadow">
	<img
		alt="front-{pokemon.id}"
		class="w-24 aspect-square"
		src="{pokemon.sprite.front}"
	>
	<div class="w-full flex-1 flex flex-col items-center gap-2">
		<p class="flex-1 text-center font-bold">{pokemon.name}</p>
		<div class="flex gap-2 justify-center w-full">
			{#each pokemon.types as type(type)}
				<div class="w-1/2">
					<img
						src="{base}{getPokemonTypeLogoImage(type)}"
						alt="type-{pokemon.name}-{type}"
						class="w-24 h-auto scale-150"
					>
				</div>
			{/each}
		</div>
		{#if pokemon.isOwned}
			<div class="absolute top-0 left-0 bg-success rounded-br-xl w-fit px-2">Owned
				Lv.{pokemon.ownedLevel}</div>
		{/if}
		{#if pokemon.encounter}
			<div class="flex justify-center">
				<button
					on:click={() => catchPokemonHandler(pokemon)}
					class="bg-success flex-1 rounded-full px-4 py-1 hover:opacity-50 hover:text-white flex flex-col items-center">
					<div class="flex gap-1 items-center">
						<img class="w-5 aspect-square" src="{base}/images/pokeball_item.png"
								 alt="catch-logo">
						<span>Catch</span>
					</div>
					<!--									<span>Lv 1-{pokemon.encounter.max_level}</span>-->
					<!--									<span>({pokemon.encounter.chance}%)</span>-->
				</button>
			</div>
		{/if}
	</div>
</li>