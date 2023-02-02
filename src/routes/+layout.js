import { error, redirect } from '@sveltejs/kit';
import { getOrigin } from '$lib/constants';

/** @type {import('./$types').PageLoad} */
export async function load({ data, fetch, url }) {
	const origin = getOrigin(url);
	console.log(origin);
	const response = await fetch(`${origin}/api/users/@me`, {
		credentials: 'include',
		mode: 'cors'
	});
	const isJSON = response.headers.get('Content-Type')?.includes('json');
	const body = isJSON ? await response.json() : await response.text();
	if (response.status === 401) {
		throw redirect(307, `${origin}/auth/login`);
	} else if (!response.ok) {
		console.error(body);
		throw error(response.status, isJSON ? JSON.stringify(body) : body);
	} else {
		return {
			client: await (await fetch(`${origin}/api/client`, { credentials: 'include' })).json(),
			theme: data.theme,
			user: body
		};
	}
}
