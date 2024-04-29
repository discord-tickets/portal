import { error } from '@sveltejs/kit';
import Big from 'big-integer';

/** @type {import('./$types').PageLoad} */
export async function load({ fetch, params }) {
	if (params.guild.split('.')[0] === 'favicon') error(404, 'Not Found');
	const guildId = new Big(params.guild, 36);
	const response = await fetch(`/api/guilds/${guildId}`);
	const body = await response.json();
	if (!response.ok) error(response.status, JSON.stringify(body));
	return {
		guild: body
	};
}
