// import { importJSON } from '$lib/i18n';

/** @type {import('./$types').PageLoad} */
export async function load() {
	// TODO: dynamic locale
	// const locale = 'en-GB';
	console.log(import.meta.glob('$lib/locales/**/*'))
	return {
		// translations: importJSON(
		// 	await import(`$lib/locales/${locale}/index2.json`)
		// )
	};
}
