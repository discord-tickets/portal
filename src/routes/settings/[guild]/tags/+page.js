import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export async function load({ fetch, params }) {
	const response = await fetch(`/api/admin/guilds/${params.guild}/tags`);
	const isJSON = response.headers.get('Content-Type')?.includes('json');
	const body = isJSON ? await response.json() : await response.text();
	if (!response.ok) {
		error(response.status, isJSON ? JSON.stringify(body) : body);
	} else {
		return {
			tags: body
		};
	}
}
