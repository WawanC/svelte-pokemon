<script lang="ts">
	import Icon from '@iconify/svelte';
	import type { PokemonLocation } from '../../types/pokemon';

	export let location: PokemonLocation;
</script>

<li>
	<a href="/locations/{location.originalName}">
		<div
			class="border border-black p-2 bg-accent rounded shadow flex gap-1 items-center hover:bg-neutral-50 hover:text-black transition-all">
			<Icon class="text-xl" icon="mdi:location" />
			<span>{location.name}</span>
		</div>
	</a>
</li>