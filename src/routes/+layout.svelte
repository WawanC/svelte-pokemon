<script lang="ts">
	import '../app.css';
	import { navigating } from '$app/stores';
	import { userStore } from '$lib/stores/auth';
	import { base } from '$app/paths';
	import { getToastClass, toastStore } from '$lib/stores/toast';

	$: toasts = $toastStore.toasts;
</script>

<html lang="en">
<head>
	<title>Pokemon App</title>
</head>
<body>
{#if $navigating || !$userStore?.isLoaded}
	<main class="fixed inset-0 z-30 bg-primary flex justify-center items-center">
		<img alt="loading-icon" class="w-36 aspect-square animate-spin" src="{base}/images/pokeball.png">
	</main>
{/if}
{#each toasts as toast, i}
	<div class="fixed transition-all top-2 left-0 right-0 flex justify-center">
		<div class="w-1/2 p-4 text-xl rounded text-black {getToastClass(toast)}">
			<span>{toast.title}</span>
		</div>
	</div>
{/each}
<slot />
</body>
</html>