<script lang="ts">
	import { goto } from '$app/navigation';

	const redirectToBase = () => {
		goto('/');
	};
</script>

<main class="flex flex-col items-center p-4 gap-8">
	<h1 class="text-4xl font-bold">Pokemon App</h1>
	<section class="flex flex-row gap-4 items-center">
		<a class="bg-accent p-4 rounded shadow" href="/pokemons">
			<span>Browse Pokemon</span>
		</a>
		<a class="bg-accent p-4 rounded shadow" href="/locations">
			<span>Explore Locations</span>
		</a>
		<button on:click={redirectToBase} class="px-3 py-2 bg-blue-200 rounded shadow text-black"
			>Go Base</button
		>
	</section>
</main>
