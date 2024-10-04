<main class="flex flex-col items-center p-4 gap-8">
	<a
		class="flex gap-1 items-center bg-accent px-3 py-2 rounded shadow text-white"
		href="/dashboard">
		<Icon class="text-xl" icon="ep:back" />
		<span>Back</span>
	</a>

	<h1 class="text-4xl font-bold">Explore Locations</h1>
	<section class="flex flex-col gap-4 items-center">
		<LocationSearchBar />
		<ul class="flex flex-wrap justify-center gap-2">
			{#each pokemonLocations as location(location.id)}
				<LocationItem location={location} />
			{/each}
		</ul>
	</section>
</main>

<script lang="ts">
	import type { PageData } from './$types';
	import LocationItem from '$lib/components/LocationItem.svelte';
	import LocationSearchBar from '$lib/components/LocationSearchBar.svelte';
	import Icon from '@iconify/svelte';

	export let data: PageData;
	$: pokemonLocations = data.locations;
</script>
