import { error, redirect } from '@sveltejs/kit';
import { ROOT } from '$lib/constants';

/** @type {import('./$types').PageLoad} */
export async function load({ fetch, params }) {
	const url = `${ROOT}/api/admin/guilds/${params.guild}`;
	const fetchOptions = { credentials: 'include' };
	const response = await fetch(url, fetchOptions);
	const isJSON = response.headers.get('Content-Type')?.includes('json');
	const body = isJSON ? await response.json() : await response.text();
	if (response.status === 401) {
		throw redirect(307, `${ROOT}/auth/login`);
	} else if (!response.ok) {
		throw error(response.status, isJSON ? JSON.stringify(body) : body);
	} else {
		return {
			guild: body,
			problems: await (
				await fetch(`${ROOT}/api/admin/guilds/${params.guild}/problems`, fetchOptions)
			).json()
		};
	}
}
