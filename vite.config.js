import { sveltekit } from '@sveltejs/kit/vite';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit()],
	server: {
		host: '127.0.0.1',
		proxy: {
			'/api': {
				target: 'http://127.0.0.1',
				changeOrigin: true
			},
			'/attachments': {
				target: 'http://127.0.0.1',
				changeOrigin: true
			},
			'/auth': {
				target: 'http://127.0.0.1',
				changeOrigin: true
			},
			'/avatars': {
				target: 'http://127.0.0.1',
				changeOrigin: true
			}
		}
	}
};

export default config;
