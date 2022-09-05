import cookie from 'cookie';

/** @type {import('./$types').LayoutServerLoad} */
export function load({ request }) {
	const cookies = cookie.parse(request.headers.get('Cookie') || '');
	return {
		isDark: cookies.theme === 'dark'
	};
}