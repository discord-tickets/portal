const fastify = require('fastify');
const session = require('fastify-secure-session');
const { randomBytes } = require('crypto');
const fs = require('fs');
const Keyv = require('keyv');
const { join } = require('path');

module.exports = (Plugin) => {
	return class SettingsServer extends Plugin {
		constructor(client, manifest) {
			super(client, manifest, {
				name: 'Settings server'
			});
		}

		path(path) {
			return join(__dirname, '../', path);
		}

		async preload() {

			this.keyv = new Keyv({
				ttl: 86400000
			});

			this.fastify = fastify();

			this.fastify.register(this.client.log.fastify(), {
				level: 'http',
				format: '&lSETTINGS:&r {status-colour}{status}&r {method} &7{route} {time-colour}({time})'
			});

			this.fastify.register(session, {
				secret: randomBytes(48).toString('hex'),
				salt: randomBytes(8).toString('hex'),
				cookie: {
					path: '/',
					httpOnly: true,
				},
			});

			this.fastify.register(require('fastify-static'), {
				root: this.path('./dist'),
				// prefix: '/public/',
			});

			let host = process.env.HTTP_HOST;
			if (!host.endsWith('/')) host = host + '/';
			this.redirect_uri = encodeURI(`${host}auth/callback`);
		}

		async load() {
			const routes = fs.readdirSync(this.path('./server/routes'))
				.filter(file => file.endsWith('.js'));
			const events = fs.readdirSync(this.path('./server/socket'))
				.filter(file => file.endsWith('.js'));

			for (const r of routes) {
				const {
					method,
					route,
					execute
				} = require(`./routes/${r}`);
				this.fastify[method](route, (...args) => execute(this, ...args));
			}

			this.fastify.listen(process.env.HTTP_PORT || 8080, (err, host) => {
				if (err) throw err;
				this.client.log.info(`Settings server listening at ${host}`);
			});

			let io_options = {};
			if (process.env.NODE_ENV == 'development')
				io_options.cors = {
					origin: [process.env.HTTP_HOST, 'http://localhost:8081'],
					credentials: true,
				};
			this.io = require('socket.io')(this.fastify.server, io_options);

			this.io.on('connection', async (socket) => {
				const { auth } = socket.handshake;
				if (!auth || !await this.keyv.get(auth.uuid)) {
					this.client.log.ws('Received unauthorised connection');
					return this.client.log.warn('Unauthorised attempt to connect to settings socket');
				}

				this.client.log.ws('A client has connected to settings socket');

				for (const e of events) {
					const {
						event,
						execute
					} = require(`./socket/${e}`);
					socket.on(event, (...args) => execute(this, socket, ...args));
				}
			});
		}
	};
};