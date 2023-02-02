import { error, redirect } from '@sveltejs/kit';
import { getOrigin } from '$lib/constants';

/** @type {import('./$types').PageLoad} */
export async function load({ fetch, params, url }) {
	const origin = getOrigin(url);
	const fetchOptions = { credentials: 'include' };
	const response = await fetch(`${origin}/api/admin/guilds/${params.guild}/settings`, fetchOptions);
	const isJSON = response.headers.get('Content-Type')?.includes('json');
	const body = isJSON ? await response.json() : await response.text();
	if (response.status === 401) {
		throw redirect(307, `${origin}/auth/login`);
	} else if (!response.ok) {
		throw error(response.status, isJSON ? JSON.stringify(body) : body);
	} else {
		return {
			url: `${origin}/api/admin/guilds/${params.guild}/settings`,
			settings: body,
			channels: await (
				await fetch(
					`${origin}/api/admin/guilds/${params.guild}/data?query=channels.cache`,
					fetchOptions
				)
			).json(),
			locales: await (await fetch(`${origin}/api/locales`, fetchOptions)).json(),
			roles: await (
				await fetch(`${origin}/api/admin/guilds/${params.guild}/data?query=roles.cache`, fetchOptions)
			).json()
		};
	}
}
