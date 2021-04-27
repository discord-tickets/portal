module.exports = {
	event: 'getUser',
	execute: async (plugin, socket, callback) => {
		const { auth } = socket.handshake;
		let { id } = await plugin.keyv.get(auth.uuid);
		let user = await plugin.client.users.cache.fetch(id);

		callback({
			avatar: user.displayAvatarURL(),
			username: user.username,
			discriminator: user.discriminator,
			id: user.id,
		});
	}
};