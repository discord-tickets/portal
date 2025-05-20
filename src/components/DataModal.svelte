<script>
	import { page } from '$app/stores';
	import { fly } from 'svelte/transition';
	import { modals, onBeforeClose } from 'svelte-modals';
	import ImportModal from './ImportModal.svelte';
	import ResetModal from './ResetModal.svelte';
	let { isOpen, close, guild } = $props();

	let allowClose = $state(true);
	onBeforeClose(() => allowClose);
</script>

{#if isOpen}
	<div
		role="dialog"
		class="modal mx-auto my-4 max-w-lg sm:my-12 md:my-24 lg:my-32"
		transition:fly|global={{ y: 50 }}
		>
		<div
			class="pointer-events-auto max-h-full w-full overflow-y-auto rounded-xl bg-white p-4 text-gray-800 shadow-sm dark:bg-slate-700 dark:text-slate-300"
		>
			<div class="m-2 flex flex-col gap-6 sm:m-4">
				<div class="text-center">
					<h2 class="text-2xl font-bold">Server data</h2>
					<h4 class="text-lg font-semibold leading-tight text-gray-500 dark:text-slate-400">
						Manage your server data
					</h4>
				</div>

				<div class="flex flex-col gap-2">
					<a
						data-sveltekit-reload
						href={`/api/admin/guilds/${$page.params.guild}/export`}
						class="group rounded-xl bg-green-300 p-4 text-left transition duration-300 hover:bg-green-500 hover:text-white dark:bg-green-500/20 dark:hover:bg-green-500"
					>
						<div class="flex items-center gap-2 md:gap-4">
							<div class="flex w-full items-center gap-4">
								<i class="fa-solid fa-file-export px-4 text-2xl"></i>
								<div class="w-full">
									<span class="text-lg font-semibold">Export (backup)</span>
									<div class="text-sm">Download all of your server data</div>
								</div>
							</div>
						</div>
					</a>
					<button
						class="group rounded-xl bg-orange-300 p-4 text-left transition duration-300 hover:bg-orange-500 hover:text-white dark:bg-orange-500/20 dark:hover:bg-orange-500"
						onclick={() => modals.open(ImportModal, { guild })}
					>
						<div class="flex items-center gap-2 md:gap-4">
							<div class="flex w-full items-center gap-4">
								<i class="fa-solid fa-file-import px-4 text-2xl"></i>
								<div class="w-full">
									<span class="text-lg font-semibold">Import (restore)</span>
									<div class="text-sm">Overwrite all existing data with uploaded data</div>
								</div>
							</div>
						</div>
					</button>
					<button
						class="group rounded-xl bg-red-300 p-4 text-left transition duration-300 hover:bg-red-500 hover:text-white dark:bg-red-500/20 dark:hover:bg-red-500"
						onclick={() => modals.open(ResetModal)}
					>
						<div class="flex items-center gap-2 md:gap-4">
							<div class="flex w-full items-center gap-4">
								<i class="fa-solid fa-power-off px-4 text-2xl"></i>
								<div class="w-full">
									<span class="text-lg font-semibold">Reset server</span>
									<div class="text-sm">Delete all settings, archives, and everything else</div>
								</div>
							</div>
						</div>
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
