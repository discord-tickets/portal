import { error, redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export async function load({ data, fetch, url }) {
	const response = await fetch(`/api/users/@me`);
	const isJSON = response.headers.get('Content-Type')?.includes('json');
	const body = isJSON ? await response.json() : await response.text();
	if (response.status === 401) {
		throw redirect(
			307,
			`/login?r=${encodeURIComponent(url.pathname + url.search + url.hash)}`
		);
	} else if (!response.ok) {
		throw error(response.status, isJSON ? JSON.stringify(body) : body);
	} else {
		return {
			client: await (await fetch(`/api/client`, { credentials: 'include' })).json(),
			theme: data.theme,
			user: body
		};
	}
}
