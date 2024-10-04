<script>
	import Icon from '@iconify/svelte';
</script>

<main class="min-h-screen flex flex-col justify-center items-center gap-8">
	<h1 class="text-center text-6xl font-bold">Pokemon App</h1>
	<div class="flex gap-4 flex-col lg:flex-row items-center">
		<a class="flex gap-1 items-center text-xl bg-success hover:opacity-50 px-3 py-2 rounded" href="/auth/login">
			<Icon icon="material-symbols:login" />
			<span>Login</span>
		</a>
		<a class="flex gap-1 items-center text-xl bg-success hover:opacity-50 px-3 py-2 rounded" href="/auth/register">
			<Icon icon="mdi:register" />
			<span>Register</span>
		</a>
	</div>
</main>