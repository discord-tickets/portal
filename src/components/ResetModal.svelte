<script>
	import { page } from '$app/stores';
	import { fly } from 'svelte/transition';
	import { onBeforeClose } from 'svelte-modals';

	let { isOpen, close } = $props();

	let allowClose = $state(true);
	onBeforeClose(() => allowClose);

	let loading = $state(false);

	async function reset() {
		const confirmed = confirm('Are you sure you want to reset this server?');
		if (!confirmed) return;
		loading = true;
		await fetch(`/api/admin/guilds/${$page.params.guild}`, {
			method: 'DELETE'
		});
		window.location = window.location;
	}
</script>

{#snippet warning(message)}
	<div
		class="rounded-xl border-2 border-orange-600 bg-orange-400/20 p-2 font-medium text-orange-600 dark:border-orange-400 dark:bg-orange-500/20 dark:text-orange-400"
	>
		<div class="flex items-center gap-2">
			<i class="fa-solid fa-triangle-exclamation mx-2 text-2xl"></i>
			<div>
				{message}
			</div>
		</div>
	</div>
{/snippet}

{#if isOpen}
	<div
		role="dialog"
		class="modal mx-auto my-4 max-w-lg sm:my-12 md:my-24 lg:my-32"
		transition:fly|global={{ y: 50 }}
	>
		<div
			class="pointer-events-auto max-h-full w-full overflow-y-auto rounded-xl bg-white p-4 text-slate-800 shadow-sm dark:bg-slate-700 dark:text-slate-300"
		>
			<div class="m-2 flex flex-col gap-6 sm:m-4">
				<div class="text-center">
					<h2 class="text-2xl font-bold">Reset</h2>
					<!-- <h4 class="text-lg font-semibold leading-tight text-slate-500 dark:text-slate-400">
						Manage your server data
					</h4> -->
				</div>

				<a
					data-sveltekit-reload
					class="rounded-xl bg-red-500 p-4 px-8 font-medium text-white duration-300 hover:bg-red-500/25 hover:text-red-500"
					href={`/api/admin/guilds/${$page.params.guild}/export`}
				>
					<div class="flex items-center gap-8">
						<i class="fa-solid fa-triangle-exclamation text-5xl"></i>
						<div>
							<p class="text-lg font-bold">
								ALL SETTINGS AND TICKETS, INCLUDING ARCHIVED MESSAGES WILL BE DELETED!
							</p>
							<p>Do you want to export a backup first?</p>
						</div>
					</div>
				</a>
				<div class="text-center">
					<button
						type="button"
						disabled={loading}
						class="rounded-lg bg-red-500 p-2 px-5 font-semibold text-white duration-300 hover:bg-red-500/25 hover:text-red-500 disabled:cursor-not-allowed disabled:bg-red-500/25"
						onclick={reset}
					>
						{#if loading}
							<i class="fa-solid fa-spinner animate-spin"></i>
						{:else}
							<i class="fa-solid fa-trash"></i>
						{/if}
						Reset this server
					</button>
				</div>
				<div class="flex justify-center gap-8">
					<button
						class="rounded-lg p-2 px-5 font-semibold transition duration-300 hover:text-black dark:hover:text-white"
						onclick={() => close()}
					>
						Cancel
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}
