<script>
	import { page } from '$app/stores';
	import { fly } from 'svelte/transition';
	import { onBeforeClose } from 'svelte-modals';
	import Zip from 'jszip';
	import Spinner from './Spinner.svelte';
	import { getContext } from 'svelte';

	let { isOpen, close, guild } = $props();

	let allowClose = $state(true);
	onBeforeClose(() => allowClose);

	const client = getContext('client');

	let files = $state();
	let file = $derived(files && files[0]);
	let loading = $state(false);
	let iconUrl = $state();
	let comment = $state();
	let exportedAt = $state();
	let sameClient = $derived(comment?.exportedFromClientId === client.id);
	let sameGuild = $derived(comment?.originalGuildId === $page.params.guild);
	let sameVersion = $derived(comment?.version === client.version);
	let borderColour = $derived(
		comment && sameVersion && sameClient && sameGuild
			? 'border-green-600 dark:border-green-400'
			: 'border-orange-600 dark:border-orange-400'
	);
	let submitted = $state(false);
	let logs = $state('');

	$effect(async () => {
		if (file) {
			loading = true;
			let zip = await Zip.loadAsync(file);
			let iconFile = zip.file('icon.png');
			if (iconFile) {
				iconUrl = `data:image/png;base64, ${await iconFile.async('base64')}`;
			} else {
				iconUrl = undefined;
			}
			try {
				const data = JSON.parse(zip.comment);
				comment = data;
				exportedAt = new Intl.DateTimeFormat('default', {
					dateStyle: 'long',
					timeStyle: 'long'
				}).format(new Date(comment.exportedAt));
			} catch {
				comment = false;
			}
			loading = false;
		}
	});

	async function submit(event) {
		event.preventDefault();
		allowClose = false;
		submitted = true;
		loading = true;
		const data = new FormData(event.target);
		const res = await fetch(`/api/admin/guilds/${$page.params.guild}/import`, {
			method: 'POST',
			body: data
		});
		const stream = res.body.pipeThrough(new TextDecoderStream());
		for await (const chunk of stream) {
			logs += chunk;
		}
		loading = false;
		allowClose = true;
	}
	/**
	 * * this comment ensures these styles are included in the build (they are streamed from the server)
	 * text-red-500 text-red-700 dark:text-red-200 font-bold
	 * text-cyan-500 text-cyan-700 dark:text-cyan-200
	 * text-green-500 text-green-700 dark:text-green-200
	 * text-orange-500 text-orange-700 dark:text-orange-200
	 */
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
		class="modal mx-auto my-4 max-w-xl sm:my-12 md:my-24 lg:my-32"
		transition:fly|global={{ y: 50 }}
	>
		<div
			class="pointer-events-auto max-h-full w-full overflow-y-auto rounded-xl bg-white p-4 text-slate-800 shadow-sm dark:bg-slate-700 dark:text-slate-300"
		>
			<div class="m-2 flex flex-col gap-6 sm:m-4">
				<div class="text-center">
					<h2 class="text-2xl font-bold">{submitted ? 'Importing' : 'Import'} data</h2>
					<!-- <h4 class="text-lg font-semibold leading-tight text-slate-500 dark:text-slate-400">
						Manage your server data
					</h4> -->
				</div>

				{#if !file}
					<a
						data-sveltekit-reload
						class="rounded-xl bg-red-500 p-4 px-8 font-medium text-white duration-300 hover:bg-red-500/25 hover:text-red-500"
						href={`/api/admin/guilds/${$page.params.guild}/export`}
					>
						<div class="flex items-center gap-8">
							<i class="fa-solid fa-triangle-exclamation text-5xl"></i>
							<div>
								<p class="text-lg font-bold">Importing deletes all existing data!</p>
								<p>Do you want to export a backup first?</p>
							</div>
						</div>
					</a>
				{/if}

				<form
					action={`/api/admin/guilds/${$page.params.guild}/import`}
					method="POST"
					enctype="multipart/form-data"
					onsubmit={submit}
				>
					<div>
						{#if submitted}
							{#if loading}
								<Spinner></Spinner>
							{/if}
							<div
								bind:this={logsContainer}
								class="flex max-h-64 flex-col gap-1 overflow-y-auto text-wrap rounded-xl bg-gray-100 p-4 font-mono shadow-sm dark:bg-slate-800"
							>
								{@html logs}
							</div>
						{:else}
							<input
								accept=".zip, application/zip, application/zip-compressed, application/x-zip-compressed"
								bind:files
								id="zip"
								name="zip"
								type="file"
								class="dark:hover:bg-slate-800block w-full cursor-pointer rounded-lg border-2 border-dashed border-slate-300 bg-gray-50 bg-slate-100/50 p-4 text-sm text-gray-900 transition duration-300 file:mr-4 file:rounded-full file:border-0 file:bg-blurple file:p-2 file:px-4 file:text-white hover:border-slate-400 hover:bg-slate-200 focus:outline-none dark:border-slate-600 dark:bg-gray-700 dark:bg-slate-800/50 dark:text-gray-400 dark:placeholder-gray-400 dark:hover:border-slate-500"
							/>
							{#if loading}
								<Spinner></Spinner>
							{:else if file}
								{@const size = (file.size / 10 ** 3).toFixed(2)}
								<div class="my-4 flex flex-col items-center gap-4">
									{#if !comment}
										{@render warning(
											"This file doesn't appear to be a valid export, or it may have been modified. You can still try to upload it."
										)}
									{/if}
									<div
										class={`flex w-full items-center justify-around gap-4 rounded-xl border-2 bg-gray-100 p-4 shadow-sm dark:bg-slate-800 ${borderColour}`}
									>
										<img
											src={iconUrl}
											alt="?"
											class="h-24 w-24 rounded-full text-center text-3xl font-bold"
										/>
										<div class="flex flex-col gap-2 leading-tight">
											<span class="text-lg font-bold">
												{comment?.originalGuildName || 'Unknown'}
											</span>
											<span class="flex items-center gap-4 text-gray-500 dark:text-slate-400">
												<i class="fa-solid fa-clock"></i>
												{exportedAt || 'Unknown'}
											</span>
											<span class="flex items-center gap-4 text-gray-500 dark:text-slate-400">
												<i class="fa-solid fa-hard-drive"></i>
												{size} MB
											</span>
											<span
												class={`flex items-center gap-4 ${sameVersion ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}`}
											>
												<i class="fa-solid fa-code-branch"></i>
												Version {comment?.version || 'unknown'}
											</span>
											{#if comment && !sameClient}
												<span class="flex items-center gap-4 text-orange-600 dark:text-orange-400">
													<i class="fa-solid fa-fingerprint"></i>
													Exported from a different instance
												</span>
											{/if}
											{#if comment && !sameGuild}
												<span class="flex items-center gap-4 text-orange-600 dark:text-orange-400">
													<i class="fa-solid fa-server"></i>
													Exported from a different guild
												</span>
											{/if}
										</div>
									</div>
									<i class="fa-solid fa-arrow-down-long text-xl font-bold"></i>
									<div
										class="flex w-full items-center justify-around gap-4 rounded-xl border-2 border-blurple bg-gray-100 p-4 shadow-sm dark:bg-slate-800"
									>
										<img
											src={guild.logo}
											alt="?"
											class="h-24 w-24 rounded-full text-center text-3xl font-bold"
										/>
										<div class="flex flex-col gap-2 leading-tight">
											<span class="text-lg font-bold">
												{guild.name}
											</span>
											<span class="flex items-center gap-4 text-gray-500 dark:text-slate-400">
												<i class="fa-solid fa-code-branch"></i>
												Version {client.version}
											</span>
											<span class="flex items-center gap-4 text-red-600 dark:text-red-400">
												<i class="fa-solid fa-gears"></i>
												All settings will be reset
											</span>
											{#if guild.stats.tickets > 0}
												<span class="flex items-center gap-4 text-red-600 dark:text-red-400">
													<i class="fa-solid fa-ticket"></i>
													{guild.stats.tickets} tickets and their transcripts will be deleted
												</span>
											{/if}
											<div class="mt-4">
												<button
													type="submit"
													disabled={submitted}
													class="rounded-lg bg-red-500 p-2 px-5 font-semibold text-white duration-300 hover:bg-red-500/25 hover:text-red-500 disabled:cursor-not-allowed"
												>
													<span class="flex items-center gap-4">
														{#if submitted}
															<i class="fa-solid fa-spinner animate-spin"></i>
														{:else}
															<i class="fa-solid fa-file-import"></i>
														{/if}
														Import
													</span>
												</button>
											</div>
										</div>
									</div>
								</div>
							{/if}
						{/if}
					</div>
				</form>
				{#if allowClose}
					<div class="flex justify-center gap-8">
						{#if submitted}
							<button
								class="rounded-lg bg-blurple p-2 px-5 font-semibold text-white duration-300 hover:bg-blurple/25"
								onclick={() => (window.location = window.location)}
							>
								Refresh
							</button>
						{:else}
							<button
								class="rounded-lg p-2 px-5 font-semibold transition duration-300 hover:text-black dark:hover:text-white"
								onclick={() => close()}
							>
								Cancel
							</button>
						{/if}
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}
