import { error, redirect } from '@sveltejs/kit';
import { PUBLIC_HOST } from '$env/static/public';

/** @type {import('./$types').PageLoad} */
export async function load({ data, fetch }) {
	const url = `${PUBLIC_HOST}/api/users/@me`;
	const response = await fetch(url, {
		credentials: 'include',
		mode: 'cors',
	});
	const isJSON = response.headers.get('Content-Type')?.includes('json')
	const body = isJSON ? await response.json() : await response.text();
	if (response.status === 401) {
		throw redirect(307, `${PUBLIC_HOST}/auth/login`);
	} else if (!response.ok) {
		throw error(response.status, isJSON ? JSON.stringify(body) : body);
	} else {
		return {
			client: await (await fetch(`${PUBLIC_HOST}/api/client`, { credentials: 'include' })).json(),
			theme: data.theme,
			user: body
		};
	}
}