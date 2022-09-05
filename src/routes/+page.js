import { dev } from '$app/environment';
import { PUBLIC_HOST } from '$env/static/public';
const host = dev ? PUBLIC_HOST : '';

/** @type {import('./$types').PageLoad} */
export async function load({ fetch }) {;
	const fetchOptions = { credentials: 'include' };
	return {
		guilds: await (await fetch(`${host}/api/admin/guilds`, fetchOptions)).json(),
	};
}