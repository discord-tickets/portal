<script context="module">
	const host = import.meta.env.PROD ? '' : import.meta.env.VITE_HOST;
	/** @type {import('./__types/[slug]').Load} */
	export async function load({ params, fetch, session, stuff }) {
		const url = `${host}/api/admin/guilds/${params.guild}`;
		const fetchOptions = {
			credentials: 'include',
			headers: {
				'Content-type': 'application/json; charset=UTF-8'
			}
		};
		const response = await fetch(url, fetchOptions);
		const body = response.status < 500 ? await response.json() : null;
		return {
			status: response.status,
			error: !response.ok ? body?.message || String(response.status) : null,
			props: {
				guild: body,
				problems: await (
					await fetch(`${host}/api/admin/guilds/${params.guild}/problems`, fetchOptions)
				).json()
			}
		};
	}
</script>

<script>
	export let guild;
	export let problems;
	import { onMount } from 'svelte';

	let createdAt = '';
	onMount(() => {
		createdAt = new Intl.DateTimeFormat(navigator.languages[0]).format(new Date(guild.createdAt));
	});

	const getProblemText = (p) => {
		switch (p.id) {
			case 'logChannelMissingPermission':
				return `Please give the bot <span class="font-mono">${p.permission}</span> permission in the log channel.`;
		}
	};
</script>

<div class="grid grid-cols-1 md:grid-cols-2 gap-12">
	<div class="text-center">
		{#each problems as problem}
			<div class="m-4">
				<div
					class="p-2 rounded-xl bg-orange-400/20 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 border-orange-600 dark:border-orange-400 border-2 font-medium"
				>
					<i class="fa-solid fa-triangle-exclamation text-2xl float-left mr-2" />
					{@html getProblemText(problem)}
				</div>
			</div>
		{/each}
		{#if guild.stats.categories.length === 0}
			<div class="m-4">
				<a href={guild.id + '/categories/new'}>
					<div class="p-2 rounded-xl border-blurple bg-blurple/20 border-2 link font-medium">
						<i class="fa-solid fa-circle-info text-2xl float-left" />
						Create a category to get started
						<i class="fa-solid fa-arrow-right-long" />
					</div>
				</a>
			</div>
		{/if}
		<div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
			<a
				href={guild.id + '/settings'}
				class="bg-gray-100 dark:bg-slate-800 p-4 rounded-xl shadow-sm link"
			>
				<i class="fas fa-gears text-4xl mb-4" />
				<p class="font-semibold text-center text-lg">General</p>
			</a>
			<a
				href={guild.id + '/categories'}
				class="bg-gray-100 dark:bg-slate-800 p-4 rounded-xl shadow-sm link"
			>
				<i class="fas fa-list text-4xl mb-4" />
				<p class="font-semibold text-center text-lg">Categories</p>
			</a>
			<a
				href={guild.id + '/panels'}
				class="bg-gray-100 dark:bg-slate-800 p-4 rounded-xl shadow-sm link"
			>
				<i class="fas fa-sliders text-4xl mb-4" />
				<p class="font-semibold text-center text-lg">Panels</p>
			</a>
			<a
				href={guild.id + '/feedback'}
				class="bg-gray-100 dark:bg-slate-800 p-4 rounded-xl shadow-sm link"
			>
				<i class="fas fa-comments text-4xl mb-4" />
				<p class="font-semibold text-center text-lg">Feedback</p>
			</a>
			<a
				href={guild.id + '/tags'}
				class="bg-gray-100 dark:bg-slate-800 p-4 rounded-xl shadow-sm link"
			>
				<i class="fas fa-tags text-4xl mb-4" />
				<p class="font-semibold text-center text-lg">Tags</p>
			</a>
			<a
				href={guild.id + '/reset'}
				class="bg-red-300 dark:bg-red-500/20 hover:bg-red-500 dark:hover:bg-red-500 p-4 rounded-xl shadow-sm transition duration-300"
			>
				<i class="fas fa-triangle-exclamation text-4xl mb-4" />
				<p class="font-semibold text-center text-lg">Reset</p>
			</a>
		</div>
	</div>
	<div>
		<div class="bg-white dark:bg-slate-700 p-4 rounded-xl shadow-sm">
			<div
				class="bg-gray-100 dark:bg-slate-800 p-4 rounded-xl shadow-sm flex items-center justify-center gap-4"
			>
				<img src={guild.logo} alt="" class="h-12 rounded-full" />
				<p>
					<span class="font-bold text-2xl">
						{guild.name}
					</span>
					<br />
					<span class="text-gray-500 dark:text-slate-400">
						<i class="fa-solid fa-calendar-days" />
						Added on
						{createdAt}
					</span>
				</p>
			</div>
			<div class="m-4 grid grid-cols-2 sm:grid-cols-3 2xl:grid-cols-5 gap-4">
				<div>
					<h6 class="font-semibold">Avg. response</h6>
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
					<p class="text-gray-500 dark:text-slate-400">{guild.stats.tickets}</p>
				</div>
				<div class="col-span-2">
					<h6 class="font-semibold">Most popular category</h6>
					<p class="text-gray-500 dark:text-slate-400">
						{guild.stats.categories.sort((a, b) => b - a)[0]?.name ?? 'None'}
					</p>
				</div>
			</div>
		</div>
	</div>
</div>
