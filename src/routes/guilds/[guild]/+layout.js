import { env } from '$env/dynamic/public';
import { error, redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export async function load({ fetch, params }) {
	const fetchOptions = { credentials: 'include' };
	const response = await fetch(`${env.PUBLIC_HOST}/api/admin/guilds/${params.guild}`, fetchOptions);
	const isJSON = response.headers.get('Content-Type')?.includes('json');
	const body = isJSON ? await response.json() : await response.text();
	if (response.status === 401) {
		throw redirect(307, `${env.PUBLIC_HOST}/auth/login`);
	} else if (!response.ok) {
		throw error(response.status, isJSON ? JSON.stringify(body) : body);
	} else {
		return { guild: body };
	}
}
