import { error, redirect } from '@sveltejs/kit';
import { PUBLIC_HOST } from '$env/static/public';

/** @type {import('./$types').PageLoad} */
export async function load({ fetch, params}) {
	const url = `${PUBLIC_HOST}/api/admin/guilds/${params.guild}`;
	const fetchOptions = { credentials: 'include' };
	const response = await fetch(url, fetchOptions);
	const isJSON = response.headers.get('Content-Type')?.includes('json');
	const body = isJSON ? await response.json() : await response.text();
	if (response.status === 401) {
		throw redirect(307, `${PUBLIC_HOST}/auth/login`);
	} else if (!response.ok) {
		throw error(response.status, isJSON ? JSON.stringify(body) : body);
	} else {
		return {
			guild: body,
			problems: await (await fetch(`${PUBLIC_HOST}/api/admin/guilds/${params.guild}/problems`, fetchOptions)).json(),
		};
	}
}