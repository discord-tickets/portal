<script context="module">
	const host = import.meta.env.PROD ? '' : import.meta.env.VITE_HOST;
	/** @type {import('./__types/[slug]').Load} */
	export async function load({ params, fetch, session, stuff }) {
		const url = `${host}/api/users/@me`;
		const response = await fetch(url, {
			credentials: 'include',
			headers: {
				'Content-type': 'application/json; charset=UTF-8'
			}
		});

		if (response.status === 401) {
			return {
				status: 302,
				redirect: `${host}/auth/login`
			};
		} else {
			return {
				status: response.status,
				props: {
					user: response.ok && (await response.json())
				}
			};
		}
	}
</script>

<script>
	export let user;
	import '../app.css';
	import '@fortawesome/fontawesome-free/css/all.css';
	import TopBar from '../components/TopBar.svelte';
	import { onMount } from 'svelte';
	let isDark = false;

	onMount(() => {
		isDark =
			localStorage.theme === 'dark' ||
			(!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
	});
</script>

<svelte:head>
	<title>Discord Tickets</title>
</svelte:head>

<div class={isDark ? 'dark' : ''}>
	<div class="bg-gray-200 dark:bg-slate-900 min-h-screen h-max w-full absolute">
		<div class="m-2 sm:m-6 lg:m-12 ">
			<div class="max-w-7xl mx-auto">
				<div class="text-gray-800 dark:text-slate-300">
					<TopBar {user} />
					<slot />
					<footer class="text-center my-24">
						<p>
							<a href="https://discordtickets.app" target="_blank" class="hover:underline"
								>Discord Tickets</a
							>
							by
							<a href="https://eartharoid.me" target="_blank" class="hover:underline"
								>eartharoid&trade;</a
							>
						</p>
						<p>
							<i class="fa-solid fa-copyright" />
							{new Date().getFullYear()}
							<a href="https://eartharoid.me" target="_blank" class="hover:underline"
								>Isaac Saunders</a
							>
						</p>
						<p class="my-4">
							<a
								href="https://lnk.earth/discord"
								target="_blank"
								class="hover:text-blurple text-lg transition duration-300"
							>
								<i class="fab fa-discord" />
							</a>
						</p>
						<p class="text-xs">
							Discord Tickets is not an official Discord product.
							<br />
							It is not affiliated with nor endorsed by Discord Inc.
						</p>
					</footer>
				</div>
			</div>
		</div>
	</div>
</div>
