import { importJSON } from '$lib/i18n';

/** @type {import('./$types').PageLoad} */
export async function load({ parent }) {
	const { locale } = await parent();
	return {
		translations: importJSON(await import(`../../../lib/locales/${locale}/_common.json`))
	};
}
