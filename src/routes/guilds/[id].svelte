<script context="module">
	const host = import.meta.env.PROD ? '' : import.meta.env.VITE_HOST;
	console.log(host);
	/** @type {import('./__types/[slug]').Load} */
	export async function load({ params, fetch, session, stuff }) {
		const url = `${host}/api/admin/guilds/${params.id}`;
		const response = await fetch(url);
		const body = response.status < 500 ? await response.json() : null;
		return {
				status: response.status,
				error: !response.ok ? body?.message || String(response.status) : null,
				props: {
					settings: body
				}
			};
	}
</script>

<script>
	export let settings;
	console.log(settings)
</script>

{settings}
...