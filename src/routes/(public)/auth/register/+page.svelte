<main class="min-h-screen flex justify-center items-center">
	<section class="min-w-[30%] p-8 gap-8 flex flex-col items-center bg-accent shadow rounded">
		<div class="flex flex-col gap-2 items-center">
			<h1 class="text-4xl font-bold">Pokemon App</h1>
			<h2 class="text-xl">Create an Account</h2>
		</div>
		{#if isLoading}
			<img src="{base}/images/pokeball.png" class="w-12 animate-spin grayscale" alt="owned-loading">
		{:else }
			<form class="flex flex-col gap-4 w-full" on:submit={submitForm}>
				{#if errorText}
					<p class="text-danger text-center">{errorText}</p>
				{/if}
				{#if successText}
					<p class="text-success text-center">{successText}</p>
				{/if}
				<div class="flex lg:gap-4 flex-col lg:flex-row justify-between lg:items-center">
					<label for="email">Username :</label>
					<input autocomplete="off" bind:value={enteredUsername} class="p-2 bg-transparent border-b outline-none"
								 id="username" type="text">
				</div>
				<div class="flex lg:gap-4 flex-col lg:flex-row justify-between lg:items-center">
					<label for="email">Email :</label>
					<input autocomplete="off" bind:value={enteredEmail} class="p-2 bg-transparent border-b outline-none"
								 id="email" type="email">
				</div>
				<div class="flex lg:gap-4 flex-col lg:flex-row justify-between lg:items-center">
					<label for="password">Password :</label>
					<input bind:value={enteredPassword} class="p-2 bg-transparent border-b outline-none" id="password"
								 type="password">
				</div>
				<div class="flex lg:gap-4 flex-col lg:flex-row justify-between lg:items-center">
					<label for="password2">Repeat Password :</label>
					<input bind:value={enteredPassword2} class="p-2 bg-transparent border-b outline-none" id="password2"
								 type="password">
				</div>
				<div class="flex justify-center">
					<button class="px-3 py-1 bg-success hover:opacity-50 rounded">Register</button>
				</div>
			</form>
		{/if}
		<p class="text-center">Already have an account ? Login <a class="underline" href="/auth/login">here</a></p>
	</section>
</main>

<script lang="ts">
	import { handleUserRegistration } from '$lib/controllers/auth';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';

	let enteredUsername = '';
	let enteredEmail = '';
	let enteredPassword = '';
	let enteredPassword2 = '';
	let errorText: string | null = null;
	let successText: string | null = null;
	let isLoading = false;

	const submitForm = async () => {
		isLoading = true;

		if (enteredUsername.trim().length < 6) {
			return setError('Username must be at least 6 characters long');
		}

		if (enteredPassword.trim().length < 6) {
			return setError('Password must be at least 6 characters long');
		}

		if (enteredPassword !== enteredPassword2) {
			return setError('Password doesn\'t matched');
		}

		const result = await handleUserRegistration(enteredUsername.trim(), enteredEmail, enteredPassword);

		if (!result.success) {
			if (result.message)
				return setError(result.message);
			return;
		}

		resetForm();
		successText = 'User success register';
		await goto('/auth/login');
	};

	const setError = (message: string) => {
		enteredPassword = '';
		enteredPassword2 = '';
		errorText = message;
		isLoading = false;
	};

	const resetForm = () => {
		enteredEmail = '';
		enteredPassword = '';
		enteredPassword2 = '';
		errorText = null;
		successText = null;
		isLoading = false;
	};

</script>