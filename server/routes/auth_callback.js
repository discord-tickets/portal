const { randomUUID } = require('crypto');
const fetch = require('node-fetch');
const FormData = require('form-data');

module.exports = {
	method: 'get',
	route: '/auth/callback',
	execute: async (plugin, req, res) => {

		if (!req.query.code) {
			res.status(400);
			return 'Bad Request: no code';
		}

		if (req.query.state !== req.session.get('state')) {
			res.status(400);
			return 'Bad Request: state mismatch';
		}

		const data = new FormData();
		data.append('client_id', plugin.client.user.id);
		data.append('client_secret', process.env.DISCORD_SECRET);
		data.append('grant_type', 'authorization_code');
		data.append('redirect_uri', plugin.redirect_uri);
		data.append('scope', 'identify guilds');
		data.append('code', req.query.code);

		let {
			access_token,
			expires_in,
			refresh_token
		} = await (await fetch('https://discordapp.com/api/oauth2/token', {
			method: 'POST',
			body: data,
		})).json();
	
		expires_in = expires_in * 1000;
		let expires_at = Date.now() + expires_in;

		let user = await (await fetch('https://discordapp.com/api/users/@me', {
			headers: {
				'Authorization': `Bearer ${access_token}`
			}
		})).json();

		let uuid = randomUUID();
		req.session.set('uuid', uuid);

		plugin.keyv.set(uuid, {
			id: user.id,
			access_token: access_token,
			refresh_token: refresh_token,
			expires_in: expires_in,
			expires_at: expires_at,
		});

		res.redirect(307, '/settings');

	}
};