<script>
	import { getContext, onMount } from 'svelte';
	import { modals } from 'svelte-modals';
	import DataModal from '$components/DataModal.svelte';
	/** @type {{data: import('./$types').PageData}} */
	let { data } = $props();

	const { guild, problems } = data;

	let createdAt = $state('');
	onMount(() => {
		createdAt = new Intl.DateTimeFormat('default').format(new Date(guild.createdAt)); // navigator.languages[0]
	});

	const problemSnippets = {
		botPublic,
		logChannelMissingPermission
	};

	const formatter = new Intl.NumberFormat();
</script>

{#snippet botPublic()}
	<span class="font-bold">WARNING:</span>
	This bot is public; anyone can add it to their servers. Is this a mistake? Learn more at
	<a
		class="underline transition duration-300 hover:text-black dark:hover:text-white"
		href="https://lnk.earth/dt-warn-pub"
		target="_blank">https://lnk.earth/dt-warn-pub</a
	>.
{/snippet}

{#snippet logChannelMissingPermission(p)}
	Please give the bot <span class="font-mono">{p.permission}</span> permission in the log channel.
{/snippet}

<div class="grid grid-cols-1 gap-12 md:grid-cols-2">
	<div>
		{#each problems as p}
			<div class="m-4">
				<div
					class="rounded-xl border-2 border-orange-600 bg-orange-400/20 p-2 font-medium text-orange-600 dark:border-orange-400 dark:bg-orange-500/20 dark:text-orange-400"
				>
					<div class="flex items-center gap-2">
						<i class="fa-solid fa-triangle-exclamation mx-2 text-2xl"></i>
						<div>
							{@render problemSnippets[p.id]?.(p)}
						</div>
					</div>
				</div>
			</div>
		{/each}
		{#if guild.stats.categories.length === 0}
			<div class="m-4">
				<a href={guild.id + '/categories/new'}>
					<div class="link rounded-xl border-2 border-blurple bg-blurple/20 p-2 font-medium">
						<div class="flex items-center gap-2">
							<i class="fa-solid fa-circle-info mx-2 text-2xl"></i>
							<div>
								Create a category to get started
								<i class="fa-solid fa-arrow-right-long"></i>
							</div>
						</div>
					</div>
				</a>
			</div>
		{/if}
		<div class="grid grid-cols-2 gap-4 text-center sm:grid-cols-3">
			<a
				href={guild.id + '/general'}
				class="link rounded-xl bg-gray-100 p-4 shadow-sm dark:bg-slate-800"
			>
				<i class="fas fa-gears mb-4 text-4xl"></i>
				<p class="text-center text-lg font-semibold">General</p>
			</a>
			<a
				href={guild.id + '/categories'}
				class="link rounded-xl bg-gray-100 p-4 shadow-sm dark:bg-slate-800"
			>
				<i class="fas fa-list mb-4 text-4xl"></i>
				<p class="text-center text-lg font-semibold">Categories</p>
			</a>
			<a
				href={guild.id + '/panels'}
				class="link rounded-xl bg-gray-100 p-4 shadow-sm dark:bg-slate-800"
			>
				<i class="fas fa-sliders mb-4 text-4xl"></i>
				<p class="text-center text-lg font-semibold">Panels</p>
			</a>
			<a
				href={guild.id + '/feedback'}
				class="link rounded-xl bg-gray-100 p-4 shadow-sm dark:bg-slate-800"
			>
				<i class="fas fa-comments mb-4 text-4xl"></i>
				<p class="text-center text-lg font-semibold">Feedback</p>
			</a>
			<a
				href={guild.id + '/tags'}
				class="link rounded-xl bg-gray-100 p-4 shadow-sm dark:bg-slate-800"
			>
				<i class="fas fa-tags mb-4 text-4xl"></i>
				<p class="text-center text-lg font-semibold">Tags</p>
			</a>
			<button
				class="rounded-xl bg-red-300 p-4 shadow-sm transition duration-300 hover:bg-red-500 dark:bg-red-500/20 dark:hover:bg-red-500"
				onclick={() => modals.open(DataModal, { guild })}
			>
				<i class="fas fa-database mb-4 text-4xl"></i>
				<p class="text-center text-lg font-semibold">Data</p>
			</button>
		</div>
	</div>
	<div>
		<div class="rounded-xl bg-white p-4 shadow-sm dark:bg-slate-700">
			<div
				class="flex items-center justify-center gap-4 rounded-xl bg-gray-100 p-4 shadow-sm dark:bg-slate-800"
			>
				<img src={guild.logo} alt="" class="h-12 rounded-full" />
				<p>
					<span class="text-2xl font-bold">
						{guild.name}
					</span>
					<br />
					<span class="text-gray-500 dark:text-slate-400">
						<i class="fa-solid fa-calendar-days"></i>
						Added on
						{createdAt}
					</span>
				</p>
			</div>
			<div class="m-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
				<div>
					<h6 class="font-semibold">Resolution time</h6>
					<p class="text-gray-500 dark:text-slate-400">{guild.stats.avgResolutionTime}</p>
				</div>
				<div>
					<h6 class="font-semibold">Response time</h6>
					<p class="text-gray-500 dark:text-slate-400">{guild.stats.avgResponseTime}</p>
				</div>
				<div>
					<h6 class="font-semibold">Categories</h6>
					<p class="text-gray-500 dark:text-slate-400">{guild.stats.categories.length}</p>
				</div>
				<div>
					<h6 class="font-semibold">Tags</h6>
					<p class="text-gray-500 dark:text-slate-400">{guild.stats.tags}</p>
				</div>
				<div>
					<h6 class="font-semibold">Tickets</h6>
					<p class="text-gray-500 dark:text-slate-400">{formatter.format(guild.stats.tickets)}</p>
				</div>
				<div>
					<h6 class="font-semibold">Most used category</h6>
					<p class="text-gray-500 dark:text-slate-400">
						{guild.stats.categories.sort((a, b) => b.tickets - a.tickets)[0]?.name ?? 'None'}
					</p>
				</div>
			</div>
		</div>
	</div>
</div>
