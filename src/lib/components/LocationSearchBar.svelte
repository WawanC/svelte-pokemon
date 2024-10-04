<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	let enteredSearchLocation = '';

	$: {
		if (browser) {
			const url = new URL($page.url);
			const searchParams = url.searchParams;

			searchParams.delete('location_name');

			if (enteredSearchLocation.trim().length > 0)
				searchParams.set('location_name', enteredSearchLocation.trim());

			goto('?' + searchParams.toString(), {
				keepFocus: true
			});
		}
	}
</script>

<input bind:value={enteredSearchLocation} class="border-b p-2 text-xl outline-none bg-transparent"
			 placeholder="Search location name..." type="text">