<script lang="ts">
	import { userStore } from '$lib/stores/auth';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';

	$: user = $userStore?.user;
	$: isAuthLoaded = $userStore?.isLoaded;

	$: if (isAuthLoaded && user && browser) {
		goto('/dashboard');
	}
</script>

<slot />

