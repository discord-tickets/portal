import { error, redirect } from '@sveltejs/kit';
import Negotiator from 'negotiator';
import { getSupportedLocales } from '$lib/i18n';
import ms from 'ms';

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ cookies, fetch, request, url }) {
	if (url.pathname === '/invite') {
		redirect(307, `/auth/login?invite&guild=${url.searchParams.get('guild') || ''}`)
	}
	const response = await fetch(`/api/users/@me`);
	const isJSON = response.headers.get('Content-Type')?.includes('json');
	const body = isJSON ? await response.json() : await response.text();
	if (url.pathname !== '/login') {
		if (response.status === 401) {
			let qs = `r=${encodeURIComponent(url.pathname + url.search)}`;
			if (url.pathname.startsWith('/settings')) {
				qs += '&role=admin';
			}
			redirect(307, `/login?${qs}`);
		} else if (!response.ok) {
			error(response.status, isJSON ? JSON.stringify(body) : body);
		}
	}
	let locale = cookies.get('locale');
	if (!locale) {
		const supportedLocales = getSupportedLocales();
		if (supportedLocales.includes(body.locale)) {
			locale = body.locale;
		} else {
			const negotiator = new Negotiator(request);
			locale = negotiator.language(supportedLocales);
		}
		cookies.set('locale', locale, {
			maxAge: ms('1y') / 1000,
			path: '/',
			sameSite: 'lax',
			secure: false,
			httpOnly: false
		});
	}
	return {
		client: await (await fetch(`/api/client`, { credentials: 'include' })).json(),
		locale,
		theme: cookies.get('theme'),
		user: body
	};
}
