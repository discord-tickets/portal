<script>
	import { base } from '$app/paths';
	/** @type {{data: import('./$types').PageData}} */
	let { data } = $props();

	const { client, guilds } = data;

	const good = [];
	const bad = [];

	guilds.forEach((g) => {
		if (g.added) {
			good.push(g);
		} else {
			bad.push(g);
		}
	});

	const formatter = new Intl.NumberFormat();
</script>

<div class="grid grid-cols-1 gap-12 md:grid-cols-2">
	<div class="text-center">
		<div class="grid grid-cols-1 gap-8">
			<div class="grid grid-cols-1 gap-4">
				{#if good.length === 0}
					<div class="my-4">
						<h3 class="text-xl font-semibold">Add your bot to a guild to get started</h3>
					</div>
				{:else}
					<div class="my-4">
						<h3 class="text-xl font-semibold">Manage your guilds</h3>
					</div>
					{#each good as guild}
						<a href={`${base}/settings/${guild.id}`}>
							<div
								class="link flex items-center gap-4 rounded-xl bg-gray-100 p-4 text-lg font-semibold shadow-sm dark:bg-slate-800"
							>
								<img src={guild.logo} alt="" class="h-12 rounded-full" />
								<span>{guild.name}</span>
							</div>
						</a>
					{/each}
					{#if bad.length > 0}
						<hr class="mt-4 border-white dark:border-slate-700" />
					{/if}
				{/if}
			</div>

			{#if good.length > 0}
				<div class="my-4">
					<h4 class="font-semibold">Add your bot to more guilds</h4>
				</div>
			{/if}

			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				{#each bad as guild}
					<a href={`/invite?guild=${guild.id}`}>
						<div
							class="link flex h-full items-center gap-4 rounded-xl bg-gray-100 p-3 font-semibold shadow-sm dark:bg-slate-800"
						>
							<img src={guild.logo} alt="" class="h-10 rounded-full" />
							<span>{guild.name}</span>
						</div>
					</a>
				{/each}
				<a href={'/invite'}>
					<div
						class="link flex h-full items-center gap-4 rounded-xl bg-gray-100 p-3 text-lg font-semibold shadow-sm dark:bg-slate-800"
					>
						<div class="w-full text-center">
							<i class="fa-solid fa-circle-plus mr-2"></i><span>Add</span>
						</div>
					</div>
				</a>
			</div>
		</div>
	</div>
	<div>
		<div class="mb-4 rounded-xl bg-white p-4 shadow-sm dark:bg-slate-700">
			<div
				class="flex items-center justify-center gap-4 rounded-xl bg-gray-100 p-4 font-semibold shadow-sm dark:bg-slate-800"
			>
				<img src={client.avatar} alt="" class="h-12 rounded-full" />
				<span class="text-2xl font-bold">
					{client.username}<span class="text-gray-500 dark:text-slate-400"
						>#{client.discriminator}</span
					>
				</span>
			</div>
			<div class="m-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
				<div>
					<h6 class="font-semibold">Activated users</h6>
					<p class="text-gray-500 dark:text-slate-400">{formatter.format(client.stats.activatedUsers)}</p>
				</div>
				<div>
					<h6 class="font-semibold">Archived messages</h6>
					<p class="text-gray-500 dark:text-slate-400">{formatter.format(client.stats.archivedMessages)}</p>
				</div>
				<div>
					<h6 class="font-semibold">Resolution time</h6>
					<p class="text-gray-500 dark:text-slate-400">{client.stats.avgResolutionTime}</p>
				</div>
				<div>
					<h6 class="font-semibold">Response time</h6>
					<p class="text-gray-500 dark:text-slate-400">{client.stats.avgResponseTime}</p>
				</div>
				<div>
					<h6 class="font-semibold">Categories</h6>
					<p class="text-gray-500 dark:text-slate-400">{formatter.format(client.stats.categories)}</p>
				</div>
				<div>
					<h6 class="font-semibold">Guilds</h6>
					<p class="text-gray-500 dark:text-slate-400">{formatter.format(client.stats.guilds)}</p>
				</div>
				<!-- <div>
					<h6 class="font-semibold">Avg. members</h6>
					<p class="text-gray-500 dark:text-slate-400">
						{Math.floor(client.stats.members / client.stats.guilds)}
					</p>
				</div>
				<div>
					<h6 class="font-semibold">Total members</h6>
					<p class="text-gray-500 dark:text-slate-400">{client.stats.members}</p>
				</div> -->
				<div>
					<h6 class="font-semibold">Members (avg)</h6>
					<p class="text-gray-500 dark:text-slate-400">
						{formatter.format(client.stats.members)}
						({formatter.format(Math.floor(client.stats.members / client.stats.guilds))})
					</p>
				</div>
				<div>
					<h6 class="font-semibold">Tags</h6>
					<p class="text-gray-500 dark:text-slate-400">{formatter.format(client.stats.tags)}</p>
				</div>
				<div>
					<h6 class="font-semibold">Tickets</h6>
					<p class="text-gray-500 dark:text-slate-400">{formatter.format(client.stats.tickets)}</p>
				</div>
			</div>
		</div>
	</div>
</div>

<div class="mx-auto my-8 max-w-3xl">
	<hr class="mx-24 my-8 border-white dark:border-slate-700" />
	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
		<a href="https://discordtickets.app" target="_blank" rel="noopener noreferrer">
			<div
				class="link flex items-center gap-4 rounded-xl bg-gray-50/75 p-4 shadow-sm dark:bg-slate-800/75"
			>
				<i class="fa-solid fa-book text-5xl"></i>
				<div>
					<p class="text-lg font-semibold">Documentation</p>
					<p>Follow the guide and find answers</p>
				</div>
			</div>
		</a>
		<a href="https://lnk.earth/discord" target="_blank" rel="noopener noreferrer">
			<div
				class="link flex items-center gap-4 rounded-xl bg-gray-50/75 p-4 shadow-sm dark:bg-slate-800/75"
			>
				<i class="fa-solid fa-circle-question text-5xl"></i>
				<div>
					<p class="text-lg font-semibold">Support</p>
					<p>Get help on Discord</p>
				</div>
			</div>
		</a>
	</div>
</div>
