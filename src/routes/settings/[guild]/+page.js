import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export async function load({ fetch, params }) {
	const fetchOptions = { credentials: 'include' };
	const response = await fetch(`/api/admin/guilds/${params.guild}`, fetchOptions);
	const isJSON = response.headers.get('Content-Type')?.includes('json');
	const body = isJSON ? await response.json() : await response.text();
	if (!response.ok) {
		error(response.status, isJSON ? JSON.stringify(body) : body);
	} else {
		return {
			guild: body,
			problems: await (
				await fetch(`/api/admin/guilds/${params.guild}/problems`, fetchOptions)
			).json()
		};
	}
}
