import { env } from '$env/dynamic/public';

/** @type {import('./$types').PageLoad} */
export async function load({ fetch, url }) {
	const fetchOptions = { credentials: 'include' };
	return {
		guilds: await (await fetch(`${env.PUBLIC_HOST}/api/admin/guilds`, fetchOptions)).json()
	};
}
