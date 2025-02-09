import { sveltekit } from '@sveltejs/kit/vite';
import { I18nPlugin } from '@eartharoid/vite-plugin-i18n';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [
		sveltekit(),
		I18nPlugin({
			id_regex: /((?<locale>[a-z0-9-_]+)\/)((_(?<namespace>[a-z0-9-_]+))|[a-z0-9-_]+)\.[a-z]+/i,
			include: 'src/lib/locales/*/*.json'
		})
	],
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
			},
			'/invite': {
				target: 'http://127.0.0.1',
				changeOrigin: true
			}
		}
	}
};

export default config;
