<script lang="ts">
	import { base } from '$app/paths';
	import { getPokemonTypeLogoImage } from '$lib/utils/pokemon';
	import type { Pokemon } from '../../types/pokemon';

	export let pokemon: Pokemon;
</script>

<li class="w-[40%] lg:w-[12%]">
	<a class="relative p-2 flex flex-col items-center gap-2 bg-accent rounded shadow"
		 data-sveltekit-preload-data="off"
		 href="/pokemons/{pokemon.name}"
	>
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
		</div>
	</a>

</li>