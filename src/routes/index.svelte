<script context="module">
	const host = import.meta.env.PROD ? '' : import.meta.env.VITE_HOST;
	console.log(host);
	/** @type {import('./__types/[slug]').Load} */
	export async function load({ params, fetch, session, stuff }) {
		const url = `${host}/api/users/@me`;
		const response = await fetch(url);

		if (response.status === 401) {
			return {
				status: 302,
				redirect: `${host}/auth/login`
			};
		} else {
			return {
				status: response.status,
				props: {
					client: await (await fetch(`${host}/api/client`)).json(),
					guilds: await (await fetch(`${host}/api/admin/guilds`)).json(),
					user: response.ok && (await response.json())
				}
			};
		}
	}
</script>

<script>
	export let client;
	export let guilds;
	export let user;
	import '../app.css';
	import '@fortawesome/fontawesome-free/css/all.css';
	// import Forbidden from '../components/Forbidden.svelte';
	import TopBar from '../components/TopBar.svelte';
</script>

<svelte:head>
	<title>Discord Tickets</title>
</svelte:head>

<TopBar {user} />
<div class="grid grid-cols-1 md:grid-cols-2 gap-12">
	<div class="text-center">
		<div class="grid grid-cols-1 gap-2">
			<h2 class="font-bold text-lg">Guilds</h2>
			{#if guilds.length === 0}
				<p class="text-red-600 dark:text-red-400">Your bot isn't in any guilds.</p>
			{:else}
				<p>These are the guilds that you can manage.</p>
				{#each guilds as guild}
					<a href={`/guilds/${guild.id}`}>
						<div
							class="bg-gray-100 dark:bg-slate-800 p-4 rounded-xl shadow-sm flex items-center gap-4 font-semibold hover:underline"
						>
							<img src={guild.logo} alt="" class="h-12 rounded-full" />
							<span>{guild.name}</span>
						</div>
					</a>
				{/each}
			{/if}
			<a
				href={`https://discord.com/oauth2/authorize?scope=applications.commands%20bot&permissions=268561488&client_id=${client.id}`}
				target="_blank"
			>
				<div
					class="bg-gray-100 dark:bg-slate-800 p-4 rounded-xl shadow-sm font-semibold hover:underline text-center text-lg"
				>
					<i class="fa-solid fa-circle-plus mr-2" /><span>Add</span>
				</div>
			</a>
		</div>
	</div>
	<div class="bg-white dark:bg-slate-700 p-4 rounded-xl shadow-sm">
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
		<div class="m-4 grid grid-cols-2 sm:grid-cols-3 2xl:grid-cols-5 gap-4">
			<div>
				<h6 class="font-semibold">Activated users</h6>
				<p class="text-gray-500 dark:text-slate-400">#</p>
			</div>
			<div>
				<h6 class="font-semibold">Archived messages</h6>
				<p class="text-gray-500 dark:text-slate-400">#</p>
			</div>
			<div>
				<h6 class="font-semibold">Avg. response</h6>
				<p class="text-gray-500 dark:text-slate-400">#</p>
			</div>
			<div>
				<h6 class="font-semibold">Categories</h6>
				<p class="text-gray-500 dark:text-slate-400">#</p>
			</div>
			<div>
				<h6 class="font-semibold">Guilds</h6>
				<p class="text-gray-500 dark:text-slate-400">{client.stats.guilds}</p>
			</div>
			<div>
				<h6 class="font-semibold">Avg. members</h6>
				<p class="text-gray-500 dark:text-slate-400">{Math.floor(client.stats.members / client.stats.guilds)}</p>
			</div>
			<div>
				<h6 class="font-semibold">Total members</h6>
				<p class="text-gray-500 dark:text-slate-400">{client.stats.members}</p>
			</div>
			<div>
				<h6 class="font-semibold">Tags</h6>
				<p class="text-gray-500 dark:text-slate-400">#</p>
			</div>
			<div>
				<h6 class="font-semibold">Tickets</h6>
				<p class="text-gray-500 dark:text-slate-400">#</p>
			</div>
		</div>
	</div>
</div>
