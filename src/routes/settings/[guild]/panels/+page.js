import { error, redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/public';

/** @type {import('./$types').PageLoad} */
export async function load({ fetch, params }) {
	const fetchOptions = { credentials: 'include' };
	const response = await fetch(
		`/api/admin/guilds/${params.guild}/categories`,
		fetchOptions
	);
	const isJSON = response.headers.get('Content-Type')?.includes('json');
	const body = isJSON ? await response.json() : await response.text();
	if (response.status === 401) {
		throw redirect(307, `/auth/login`);
	} else if (!response.ok) {
		throw error(response.status, isJSON ? JSON.stringify(body) : body);
	} else {
		return {
			categories: body,
			channels: await (
				await fetch(
					`/api/admin/guilds/${params.guild}/data?query=channels.cache`,
					fetchOptions
				)
			).json()
		};
	}
}
