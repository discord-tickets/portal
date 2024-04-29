import { error } from '@sveltejs/kit';
/** @type {import('./$types').PageLoad} */
export async function load({ fetch, params }) {
	const response = await fetch(`/api/admin/guilds/${params.guild}/settings`);
	const isJSON = response.headers.get('Content-Type')?.includes('json');
	const body = isJSON ? await response.json() : await response.text();
	if (!response.ok) {
		error(response.status, isJSON ? JSON.stringify(body) : body);
	} else {
		return {
			settings: body,
			channels: await (
				await fetch(`/api/admin/guilds/${params.guild}/data?query=channels.cache`)
			).json(),
			locales: await (await fetch(`/api/locales`)).json(),
			roles: await (await fetch(`/api/admin/guilds/${params.guild}/data?query=roles.cache`)).json()
		};
	}
}
