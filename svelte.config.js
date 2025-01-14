import adapter from '@sveltejs/adapter-node';
import { sveltePreprocess } from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({ out: 'build' }),
		alias: {
			$components: './src/components'
		}
	},
	preprocess: [sveltePreprocess({ postcss: true })],
	trailingSlash: 'never'
};

export default config;
