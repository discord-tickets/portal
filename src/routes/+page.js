import { PUBLIC_HOST } from '$env/static/public';

/** @type {import('./$types').PageLoad} */
export async function load({ fetch }) {;
	const fetchOptions = { credentials: 'include' };
	return {
		guilds: await (await fetch(`${PUBLIC_HOST}/api/admin/guilds`, fetchOptions)).json(),
	};
}