<script context="module">
	const host = import.meta.env.PROD ? '' : import.meta.env.VITE_HOST;
	/** @type {import('./__types/[slug]').Load} */
	export async function load({ params, fetch, session, stuff }) {
		const url = `${host}/api/admin/guilds/${params.guild}`;
		const response = await fetch(url, {
			credentials: 'include',
			headers: {
				'Content-type': 'application/json; charset=UTF-8'
			}
		});
		const body = response.status < 500 ? await response.json() : null;
		return {
			status: response.status,
			error: !response.ok ? body?.message || String(response.status) : null,
			props: {
				guild: body
			}
		};
	}
</script>

<script>
	export let guild;
</script>

<div class="text-center">
	<a
		href={'/guilds/' + guild.id}
		class="bg-gray-50/75 dark:bg-slate-800/75 p-2 px-4 rounded-xl shadow-sm text-gray-500 dark:text-slate-400 font-medium inline-block link mb-4"
	>
		<i class="fa-solid fa-arrow-left" />
		{guild.name}
	</a>
</div>

<slot />
