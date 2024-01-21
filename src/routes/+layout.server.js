import cookie from 'cookie';

/** @type {import('./$types').LayoutServerLoad} */
export function load({ request }) {
	// TODO: use `locals` for auth?
	const cookies = cookie.parse(request.headers.get('Cookie') || '');
	return {
		theme: cookies.theme
	};
}
