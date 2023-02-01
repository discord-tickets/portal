import crypto from 'crypto';

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
	const response = await resolve(event, {
		filterSerializedResponseHeaders: () => true
	});
	return response;
}

/** @type {import('@sveltejs/kit').HandleServerError} */
export function handleError({ error }) {
	const errorId = crypto.randomUUID();
	console.error(errorId, error);
	return {
		error,
		errorId
	};
}
