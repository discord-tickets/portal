// import { dev } from '$app/environment';
// import { PUBLIC_HOST } from '$env/static/public';

// const regex = /^https?:\/\/\$api/;

// /** @type {import('@sveltejs/kit').ExternalFetch} */
// export async function externalFetch(request) {
// 	if (request.url.match(regex)) {
// 		let url = request.url.replace(regex, '/api');
// 		request = new Request(
// 			(dev ? PUBLIC_HOST : '') + url,
// 			request
// 		);
// 	}
// 	console.log(request)
// 	return fetch(request);
// }