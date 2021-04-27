/* eslint-disable no-undef */
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import Buefy from 'buefy';
import 'buefy/dist/buefy.css';

Vue.use(Buefy);

Vue.config.productionTip = false;

new Vue({
	router,
	render: v => v(App),
	data: {
		socket_disconnected_toast: null,
		socket: io(SOCKET_HOST, {
			auth: {
				uuid: SOCKET_USER
			},
		}),
	},
	computed: {},
	methods: {
	},
	mounted() {
		this.socket.on('connect', () => {
			console.log('CONNECTED TO SOCKET');
			// if (app.socket_disconnected_toast) {
			// 	app.socket_disconnected_toast.close();
			// 	app.socket_disconnected_toast = null;
			// }
			this.$buefy.toast.open({
				duration: 5000,
				message: 'Connected',
				position: 'is-bottom-right',
				type: 'is-success'
			});
		});

		this.socket.on('disconnect', () => {
			console.warn('DISCONNECTED FROM SOCKET!');
			this.socket_disconnected_toast = this.$buefy.toast.open({
				indefinite: true,
				message: 'Lost connection, are you online?',
				position: 'is-bottom-right',
				type: 'is-danger'
			});
		});

		const loader = this.$buefy.loading.open({
			container: null
		});

		this.$root.socket.emit('getGuilds', guilds => {
			loader.close();
			this.$root.$data.guilds = guilds;
		});
	}
}).$mount('#app');
