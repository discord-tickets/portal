import { error, redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export async function load({ fetch, params, url }) {
	const fetchOptions = { credentials: 'include' };
	const response = await fetch(`/api/admin/guilds/${params.guild}`, fetchOptions);
	const isJSON = response.headers.get('Content-Type')?.includes('json');
	const body = isJSON ? await response.json() : await response.text();
	if (response.status === 401 && body.elevate) {
		redirect(307, `/auth/login?r=${encodeURIComponent(url.pathname + url.search)}&role=${body.elevate}`);
	} else if (!response.ok) {
		error(response.status, isJSON ? JSON.stringify(body) : body);
	} else {
		return {
			guild: body,
			problems: await (
				await fetch(`/api/admin/guilds/${params.guild}/problems`, fetchOptions)
			).json()
		};
	}
}
