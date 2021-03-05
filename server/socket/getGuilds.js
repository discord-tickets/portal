const fetch = require('node-fetch');

module.exports = {
	event: 'getGuilds',
	execute: async (plugin, socket, callback) => {
		const { auth } = socket.handshake;
		let { access_token, id } = await plugin.keyv.get(auth.uuid);

		let guilds = await(await fetch('https://discordapp.com/api/users/@me/guilds', {
			headers: {
				'Authorization': `Bearer ${access_token}`
			}
		})).json();

		if (!(guilds instanceof Array)) {
			plugin.client.log.info(guilds instanceof Array)
			plugin.client.log.info(typeof guilds)
			plugin.client.log.warn('Couldn\'t fetch user\'s guilds');
			return plugin.client.log.error(guilds);
		}

		callback(guilds
			.filter(g => plugin.client.guilds.cache.has(g.id))
			.filter(async g => {
				let members = await plugin.client.guilds.cache.get(g.id).members.fetch(id);
				return members.hasPermission('MANAGE_GUILD');
			})
			.map(g => {
				g = plugin.client.guilds.cache.get(g.id);
				let fallback_icon = new URL(`https://avatar.oxro.io/avatar.svg?background=7289DA&name=${g.name}`).toString();
				return {
					icon: g.iconURL() || fallback_icon,
					name: g.name,
					id: g.id,
				};
			}));
	}
};