import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export async function load({ url }) {
	redirect(307, `/auth/login?invite&guild=${url.searchParams.get('guild') || ''}`);
}

