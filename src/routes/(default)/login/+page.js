import { importJSON } from '$lib/i18n';

/** @type {import('./$types').PageLoad} */
export async function load({ parent, url }) {
	const { locale } = await parent();
	return {
		translations: importJSON(
			await import(`../../../lib/locales/${locale}/_common.json`),
			await import(`../../../lib/locales/${locale}/misc.json`)
		),
		query: url.search
	};
}
