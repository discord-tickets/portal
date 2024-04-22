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
	if (dev || process?.env.NODE_ENV === 'development') console.error(error);
	process?.emit('sveltekit:error', { error, errorId, event });
	return {
		name: 'Internal Server Error',
		message: error.message,
		errorId
	};
}
