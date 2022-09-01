import { error, redirect } from '@sveltejs/kit';
import { dev } from '$app/environment';
import { PUBLIC_HOST } from '$env/static/public';
const host = dev ? PUBLIC_HOST : '';

/** @type {import('./$types').PageLoad} */
export async function load({ fetch, params }) {

	const url = `${host}/api/admin/guilds/${params.guild}/categories`;
	const fetchOptions = { credentials: 'include' };

	let body;
	if (params.category === 'new') {
		body = {
			channelName: '',
			claiming: false,
			description: '',
			discordCategory: 'new',
			enableFeedback: false,
			emoji: '',
			image: '',
			memberLimit: 1,
			name: '',
			openingMessage: '',
			pingRoles: [],
			questions: [],
			ratelimit: null,
			requiredRoles: [],
			requireTopic: false,
			staffRoles: [],
			totalLimit: 50
		};
	} else {
		const response = await fetch(`${url}/${params.category}`, fetchOptions);
		const isJSON = response.headers.get('Content-Type')?.includes('json');
		body = isJSON ? await response.json() : await response.text();
		if (response.status === 401) {
			throw redirect(307, '/auth/login');
		} else if (!response.ok) {
			throw error(response.status, isJSON ? JSON.stringify(body) : body);
		}
	}

	return {
		url: params.category === 'new' ? url : `${url}/${params.category}`,
		category: body,
		channels: await (
			await fetch(
				`${host}/api/admin/guilds/${params.guild}/data?query=channels.cache`,
				fetchOptions
			)
		).json(),
		roles: await (
			await fetch(
				`${host}/api/admin/guilds/${params.guild}/data?query=roles.cache`,
				fetchOptions
			)
		).json()
	};
}