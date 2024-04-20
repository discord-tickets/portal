import { redirect } from '@sveltejs/kit';
// import { importJSON } from '@eartharoid/vite-plugin-i18n'; // doesn't work?
import { importJSON } from '$lib/i18n';

/** @type {import('./$types').PageLoad} */
export async function load({ fetch }) {
	// TODO: dynamic locale
	const locale = 'en-GB';
	const guilds = await (await fetch(`/api/guilds`)).json();
	if (guilds.length === 0) {
		throw redirect(302, '/settings');
	} else if (guilds.length === 1) {
		throw redirect(302, `/${guilds[0].id}`);
	}
	return {
		translations: importJSON(
			await import(`$lib/locales/${locale}/index.json`)
		),
		guilds
	};
}
