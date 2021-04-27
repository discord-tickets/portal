const fs = require('fs').promises;

module.exports = {
	method: 'get',
	route: '/settings',
	execute: async (plugin, req, res) => {

		let uuid = req.session.get('uuid');

		let { expires_at } = await plugin.keyv.get(uuid) || {};
		if (!expires_at) return res.redirect(307, '/auth/login');

		let expired = expires_at < Date.now();
		if (expired) return res.redirect(307, '/auth/login');

		let html = await fs.readFile(plugin.path('./dist/index.html'), {
			encoding: 'utf8'
		});

		html = html
			.replace(/%%SOCKET_HOST%%/gmi, process.env.HTTP_HOST || 'http://localhost:8080')
			.replace(/%%SOCKET_USER%%/gmi, uuid);

		res
			.type('text/html')
			.send(html);
	}
};