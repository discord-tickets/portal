import { ROOT } from '$lib/constants';

/** @type {import('./$types').PageLoad} */
export async function load({ fetch }) {
	const fetchOptions = { credentials: 'include' };
	return {
		guilds: await (await fetch(`${ROOT}/api/admin/guilds`, fetchOptions)).json()
	};
}
