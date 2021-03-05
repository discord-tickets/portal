const socket = io(SOCKET_HOST, {
	auth: {
		uuid: SOCKET_USER
	},
});

socket.on('connect', () => {
	console.log('CONNECTED TO SOCKET');
});

socket.on('disconnect', () => {
	console.warn('DISCONNECTED TO SOCKET!');
});

socket.emit('getGuilds', guilds => {
	console.log(guilds);
});