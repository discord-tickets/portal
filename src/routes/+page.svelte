<script>
	/** @type {import('./$types').PageData} */
	export let data;

	import { base } from '$app/paths'

	const { client, guilds } = data;
</script>

<div class="grid grid-cols-1 md:grid-cols-2 gap-12">
	<div class="text-center">
		<div class="grid grid-cols-1 gap-4">
			<div>
				<h3 class="font-bold text-xl">Guilds</h3>
				{#if guilds.length === 0}
					<p class="text-red-600 dark:text-red-400">Your bot isn't in any guilds.</p>
				{:else}
					<p>These are the guilds that you can manage.</p>
				{/if}
			</div>
			<a
				href={`https://discord.com/oauth2/authorize?scope=applications.commands%20bot&permissions=268561488&client_id=${client.id}`}
				target="_blank"
			>
				<div
					class="bg-gray-100 dark:bg-slate-800 p-4 rounded-xl shadow-sm font-semibold text-center text-lg link"
				>
					<i class="fa-solid fa-circle-plus mr-2" /><span>Add</span>
				</div>
			</a>
			{#each guilds as guild}
				<a href={`${base}/guilds/${guild.id}`}>
					<div
						class="bg-gray-100 dark:bg-slate-800 p-4 rounded-xl shadow-sm flex items-center gap-4 font-semibold text-lg link"
					>
						<img src={guild.logo} alt="" class="h-12 rounded-full" />
						<span>{guild.name}</span>
					</div>
				</a>
			{/each}
		</div>
	</div>
	<div>
		<div class="bg-white dark:bg-slate-700 p-4 rounded-xl shadow-sm mb-4">
			<div
				class="bg-gray-100 dark:bg-slate-800 p-4 rounded-xl shadow-sm flex items-center justify-center gap-4 font-semibold"
			>
				<img src={client.avatar} alt="" class="h-12 rounded-full" />
				<span class="font-bold text-2xl">
					{client.username}<span class="text-gray-500 dark:text-slate-400"
						>#{client.discriminator}</span
					>
				</span>
			</div>
			<div class="m-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
				<div>
					<h6 class="font-semibold">Activated users</h6>
					<p class="text-gray-500 dark:text-slate-400">{client.stats.activatedUsers}</p>
				</div>
				<div>
					<h6 class="font-semibold">Archived messages</h6>
					<p class="text-gray-500 dark:text-slate-400">{client.stats.archivedMessages}</p>
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
					<p class="text-gray-500 dark:text-slate-400">{client.stats.categories}</p>
				</div>
				<div>
					<h6 class="font-semibold">Guilds</h6>
					<p class="text-gray-500 dark:text-slate-400">{client.stats.guilds}</p>
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
						{client.stats.members}
						({Math.floor(client.stats.members / client.stats.guilds)})
					</p>
				</div>
				<div>
					<h6 class="font-semibold">Tags</h6>
					<p class="text-gray-500 dark:text-slate-400">{client.stats.tags}</p>
				</div>
				<div>
					<h6 class="font-semibold">Tickets</h6>
					<p class="text-gray-500 dark:text-slate-400">{client.stats.tickets}</p>
				</div>
			</div>
		</div>
	</div>
</div>
<div class="max-w-3xl my-8 mx-auto">
	<!-- <h2 class="font-bold text-lg mb-2 text-center">Resources</h2> -->
	<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
		<a href="https://discordtickets.app" target="_blank">
			<div
				class="bg-gray-50/75 dark:bg-slate-800/75 p-4 rounded-xl shadow-sm link flex items-center gap-4"
			>
				<i class="fa-solid fa-book text-5xl" />
				<div>
					<p class="text-lg font-semibold">Documentation</p>
					<p>Follow the guide and find answers</p>
				</div>
			</div>
		</a>
		<a href="https://lnk.earth/discord" target="_blank">
			<div
				class="bg-gray-50/75 dark:bg-slate-800/75 p-4 rounded-xl shadow-sm link flex items-center gap-4"
			>
				<i class="fa-solid fa-circle-question text-5xl" />
				<div>
					<p class="text-lg font-semibold">Support</p>
					<p>Get help on Discord</p>
				</div>
			</div>
		</a>
	</div>
</div>
