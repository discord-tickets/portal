import { dev } from '$app/environment';

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
	const response = await resolve(event, {
		filterSerializedResponseHeaders: () => true
	});
	return response;
}

/** @type {import('@sveltejs/kit').HandleServerError} */
export function handleError({ error, event }) {
	const errorId = Date.now().toString(16);

	if (dev || process?.env.NODE_ENV === 'development') console.error(errorId, error, event);

	process?.emit('sveltekit:error', { error, errorId, event });

	let message =
		typeof error === 'string' ? error : error?.message || JSON.stringify(error || 'Unknown error');

	return {
		message: message + ` (id=${errorId})`,
		errorId
	};
}
