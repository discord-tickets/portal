import { error, redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/public';

/** @type {import('./$types').PageLoad} */
export async function load({ data, fetch }) {
	console.log(env.PUBLIC_HOST);
	const response = await fetch(`${env.PUBLIC_HOST}/api/users/@me`, {
		credentials: 'include',
		mode: 'cors'
	});
	console.log(response)
	const isJSON = response.headers.get('Content-Type')?.includes('json');
	const body = isJSON ? await response.json() : await response.text();
	if (response.status === 401) {
		throw redirect(307, `${env.PUBLIC_HOST}/auth/login`);
	} else if (!response.ok) {
		console.error(body);
		throw error(response.status, isJSON ? JSON.stringify(body) : body);
	} else {
		return {
			client: await (await fetch(`${env.PUBLIC_HOST}/api/client`, { credentials: 'include' })).json(),
			theme: data.theme,
			user: body
		};
	}
}
