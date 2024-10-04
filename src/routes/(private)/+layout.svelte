<script lang="ts">
	import { base } from '$app/paths';
	import { userStore } from '$lib/stores/auth';
	import Icon from '@iconify/svelte';
	import { MAX_POKEBALLS_COUNT } from '$lib/constants/user';
	import { addPokeball } from '$lib/services/user';
	import { handleUserLogout } from '$lib/controllers/auth';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';

	$: user = $userStore?.user;
	$: isAuthLoaded = $userStore?.isLoaded;

	$: if (isAuthLoaded && !user && browser) {
		goto('/');
	}

	$:getTimeLeft = () => {
		if (!$userStore || !$userStore.pokeballTimeLeft) return null;

		const left = $userStore.pokeballTimeLeft;
		const secondsLeft = Math.floor((left / 1000) % 60);
		const minutesLeft = Math.floor((left / 60 / 1000) % 60);

		return minutesLeft.toString().padStart(2, '0') + ':' + secondsLeft.toString().padStart(2, '0');
	};

	setInterval(async () => {
		if (!$userStore || !$userStore.user || !$userStore.pokeballTimeLeft || $userStore.pokeballsCount >= MAX_POKEBALLS_COUNT) return;

		userStore.update(store => {
			if (!store || !store.pokeballTimeLeft) return store;

			return {
				...store,
				pokeballTimeLeft: store.pokeballTimeLeft - 1000
			};
		});

		if ($userStore.pokeballTimeLeft < 1000) {
			await addPokeball($userStore.user.uid, 1);
		}

	}, 1000);
</script>


{#if $userStore?.user}
	<div
		class="z-10 fixed bottom-0 left-0 right-0 lg:top-0 lg:right-auto lg:bottom-auto
	flex items-center bg-secondary text-black rounded-br-lg shadow">
		<div class="p-2">
			<img alt="pokeball" class="w-16 aspect-square" src="{base}/images/pokeball.png">
		</div>
		<div class="p-2 pr-6">
			<h1 class="text-2xl font-bold">{$userStore.username}</h1>
			<span class="px-1">{getTimeLeft()}</span>
			<div class="flex items-center gap-1">
				<img src="{base}/images/pokeball_item.png" alt="pokeball-count-img" class="w-6 aspect-square">
				<span class="text-sm font-bold">x {$userStore.pokeballsCount}</span>
			</div>
		</div>
	</div>

	<div
		class="z-20 bg-danger fixed bottom-0 right-0 lg:top-0 lg:bottom-auto p-2 pl-3 lg:rounded-bl-lg shadow hover:bg-neutral-50 hover:text-black transition-all">
		<button on:click={handleUserLogout}>
			<Icon class="text-4xl" icon="material-symbols:logout" />
		</button>
	</div>

	<slot />
{/if}
