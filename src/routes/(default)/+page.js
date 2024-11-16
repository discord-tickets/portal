import { redirect } from '@sveltejs/kit';
// import { importJSON } from '@eartharoid/vite-plugin-i18n'; // doesn't work?
import { importJSON } from '$lib/i18n';

/** @type {import('./$types').PageLoad} */
export async function load({ parent, fetch }) {
	// TODO: remove this when the portal section is more complete
	redirect(302, '/settings');

	const { locale } = await parent();
	const guilds = await (await fetch(`/api/guilds`)).json();
	if (guilds.length === 0) {
		redirect(302, '/settings');
	} else if (guilds.length === 1) {
		redirect(302, `/${guilds[0].id}`);
	}
	return {
		translations: importJSON(
			await import(`../../lib/locales/${locale}/_common.json`),
			await import(`../../lib/locales/${locale}/misc.json`)
		),
		guilds
	};
}
