<script>
	import { page } from '$app/stores';
	import ErrorBox from '$components/ErrorBox.svelte';

	const url = `/api/admin/guilds/${$page.params.guild}/settings`;

	let error = $state(null);
	let loading = $state(false);

	const del = async () => {
		try {
			const confirmed = confirm(
				'CONFIRM: Are you sure you want to permanently erase ALL guild data?'
			);
			if (!confirmed) return false;
			loading = true;
			const response = await fetch(url, {
				method: 'DELETE',
				credentials: 'include'
			});
			const body = await response.json();

			if (!response.ok) throw body;
			else window.location = './';
		} catch (err) {
			loading = false;
			error = err;
			window.scroll({
				top: 0,
				behavior: 'smooth'
			});
		}
	};
</script>

<h1 class="m-4 text-center text-4xl font-bold">Reset</h1>
<div class="m-2 mx-auto max-w-3xl text-center sm:p-4">
	{#if error}
		<ErrorBox {error} />
	{/if}
	<div
		class="inline-block max-w-lg rounded-lg bg-red-400 bg-opacity-40 p-6 px-12 text-red-800 dark:bg-red-500 dark:bg-opacity-20 dark:text-red-400"
	>
		<p class="text-xl font-semibold">Caution</p>
		This will irreversibly delete all data associated with your guild,
		<b>including tickets and archives!</b>
	</div>

	<div>
		<button
			type="button"
			disabled={loading}
			class="mt-4 rounded-lg bg-red-300 p-2 px-5 font-medium transition duration-300 hover:bg-red-500 hover:text-white disabled:cursor-not-allowed dark:bg-red-500/50 dark:hover:bg-red-500 dark:hover:text-white"
			onclick={del}
		>
			{#if loading}
				<i class="fa-solid fa-spinner animate-spin"></i>
			{:else}
				<i class="fa-solid fa-trash"></i>
			{/if}
			Delete
		</button>
	</div>
</div>
