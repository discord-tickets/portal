<script>
	import { page } from '$app/stores';

	const url = `/api/admin/guilds/${$page.params.guild}/settings`;

	let error = null;
	let loading = false;

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

<h1 class="m-4 text-4xl font-bold text-center">Reset</h1>
<div class="m-2 sm:p-4 max-w-3xl mx-auto text-center">
	{#if error}
		<div id="error" class="break-words">
			<div
				class="bg-red-400 dark:bg-red-500 text-red-800 dark:text-red-400 bg-opacity-40 dark:bg-opacity-20 mb-4 p-6 px-12 rounded-lg text-center max-w-lg inline-block"
			>
				<p class="font-semibold text-xl">Error</p>
				{error.message ?? error}
			</div>
		</div>
	{/if}
	<div
		class="bg-red-400 dark:bg-red-500 text-red-800 dark:text-red-400 bg-opacity-40 dark:bg-opacity-20 p-6 px-12 rounded-lg max-w-lg inline-block"
	>
		<p class="font-semibold text-xl">Caution</p>
		This will irreversibly delete all data associated with your guild,
		<b>including tickets and archives!</b>
	</div>

	<div>
		<button
			type="button"
			disabled={loading}
			class="mt-4 bg-red-300 hover:bg-red-500 hover:text-white dark:bg-red-500/50 dark:hover:bg-red-500 dark:hover:text-white p-2 px-5 rounded-lg font-medium transition duration-300 disabled:cursor-not-allowed"
			on:click={del}
		>
			{#if loading}
				<i class="fa-solid fa-spinner animate-spin" />
			{:else}
				<i class="fa-solid fa-trash" />
			{/if}
			Delete
		</button>
	</div>
</div>
