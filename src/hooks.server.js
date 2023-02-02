/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
	const response = await resolve(event, {
		filterSerializedResponseHeaders: () => true
	});
	return response;
}

/** @type {import('@sveltejs/kit').HandleServerError} */
export function handleError({ error }) {
	const errorId = Date.now().toString(16);
	console.error(errorId, error);
	let message =
		typeof error === 'string' ? error : error?.message || JSON.stringify(error || 'Unknown error');
	return {
		message: message + ` (id=${errorId})`,
		errorId
	};
}
