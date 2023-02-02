import { getOrigin } from '$lib/constants';

/** @type {import('./$types').PageLoad} */
export async function load({ fetch, url }) {
	const fetchOptions = { credentials: 'include' };
	return {
		guilds: await (await fetch(`${getOrigin(url)}/api/admin/guilds`, fetchOptions)).json()
	};
}
