<main class="min-h-screen flex justify-center items-center">
	<section class="min-w-[30%] p-8 gap-8 flex flex-col items-center bg-accent shadow rounded">
		<div class="flex flex-col gap-2 items-center">
			<h1 class="text-4xl font-bold">Pokemon App</h1>
			<h2 class="text-xl">Sign In</h2>
		</div>
		{#if isLoading}
			<p class="text-center">
				<img src="{base}/images/pokeball.png" class="w-12 animate-spin grayscale" alt="owned-loading">
			</p>
		{:else }
			<form class="flex flex-col gap-4 w-full" on:submit={submitForm}>
				{#if errorText}
					<p class="text-danger text-center">{errorText}</p>
				{/if}
				{#if successText}
					<p class="text-success text-center">{successText}</p>
				{/if}
				<div class="flex lg:gap-4 flex-col lg:flex-row justify-between lg:items-center">
					<label for="email">Email :</label>
					<input autocomplete="off" bind:value={enteredEmail} class="p-2 bg-transparent border-b outline-none"
								 id="email"
								 type="email">
				</div>
				<div class="flex lg:gap-4 flex-col lg:flex-row justify-between lg:items-center">
					<label for="password">Password :</label>
					<input bind:value={enteredPassword} class="p-2 bg-transparent border-b outline-none" id="password"
								 type="password">
				</div>
				<div class="flex justify-center">
					<button class="px-3 py-1 bg-success hover:opacity-50 rounded">Login</button>
				</div>

				<p class="text-center">Don't have an account ? Register <a href="/auth/register" class="underline">here</a></p>
			</form>
		{/if}
	</section>
</main>

<script lang="ts">
	import { handleUserLogin } from '$lib/controllers/auth';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';

	let enteredEmail = '';
	let enteredPassword = '';
	let errorText: string | null = null;
	let successText: string | null = null;
	let isLoading = false;

	const submitForm = async () => {
		isLoading = true;

		const result = await handleUserLogin(enteredEmail, enteredPassword);

		if (!result.success) {
			if (result.message)
				return setError(result.message);
			return;
		}

		resetForm();
		successText = 'User login register';
		await goto('/dashboard');
	};

	const setError = (message: string) => {
		enteredPassword = '';
		errorText = message;
		isLoading = false;
	};

	const resetForm = () => {
		enteredEmail = '';
		enteredPassword = '';
		errorText = null;
		successText = null;
		isLoading = false;
	};

</script>