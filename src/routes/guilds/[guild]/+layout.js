import { getOrigin } from '$lib/constants';
import { error, redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export async function load({ fetch, params, url }) {
	const origin = getOrigin(url);
	const fetchOptions = { credentials: 'include' };
	const response = await fetch(`${origin}/api/admin/guilds/${params.guild}`, fetchOptions);
	const isJSON = response.headers.get('Content-Type')?.includes('json');
	const body = isJSON ? await response.json() : await response.text();
	if (response.status === 401) {
		throw redirect(307, `${origin}/auth/login`);
	} else if (!response.ok) {
		throw error(response.status, isJSON ? JSON.stringify(body) : body);
	} else {
		return { guild: body };
	}
}
