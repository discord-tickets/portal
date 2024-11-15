import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export async function load({ fetch, params }) {
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
		const response = await fetch(
			`/api/admin/guilds/${params.guild}/categories/${params.category}`,
			fetchOptions
		);
		const isJSON = response.headers.get('Content-Type')?.includes('json');
		body = isJSON ? await response.json() : await response.text();
		if (!response.ok) {
			error(response.status, isJSON ? JSON.stringify(body) : body);
		}
	}

	let url = `/api/admin/guilds/${params.guild}/categories`;
	if (params.category !== 'new') url += `/${params.category}`;

	return {
		url,
		category: body,
		channels: await (
			await fetch(`/api/admin/guilds/${params.guild}/data?query=channels.cache`, fetchOptions)
		).json(),
		roles: await (
			await fetch(`/api/admin/guilds/${params.guild}/data?query=roles.cache`, fetchOptions)
		).json(),
		settings: await (await fetch(`/api/admin/guilds/${params.guild}/settings`, fetchOptions)).json()
	};
}
