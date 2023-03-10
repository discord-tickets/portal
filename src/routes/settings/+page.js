/** @type {import('./$types').PageLoad} */
export async function load({ fetch }) {
	const fetchOptions = { credentials: 'include' };
	return {
		guilds: await (await fetch(`/api/admin/guilds`, fetchOptions)).json()
	};
}
