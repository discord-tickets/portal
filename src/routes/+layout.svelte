<script>
	/** @type {import('./$types').PageData} */ 
	export let data;

	import '../app.css';
	import '@fortawesome/fontawesome-free/css/all.css';
	import TopBar from '../components/TopBar.svelte';
	import { onMount, setContext } from 'svelte';
	import { fade } from 'svelte/transition';
	import { navigating } from '$app/stores';
	import { Modals, closeModal } from 'svelte-modals';

	const { isDark, user } = data;
	setContext('user', user);
	let mounted = false;
	onMount(() => { mounted = true; });
</script>

<svelte:head>
	<title>Discord Tickets</title>
</svelte:head>

<div class={isDark ? 'dark' : ''}>
	<div class="bg-gray-200 dark:bg-slate-900 min-h-screen h-max w-full absolute">
		<Modals>
			<div slot="backdrop" class="backdrop" transition:fade on:click={closeModal} />
		</Modals>
		<div class="m-2 sm:m-6 lg:m-12 ">
			<div class="max-w-7xl mx-auto">
				<div class="text-gray-800 dark:text-slate-300">
					{#if $navigating || !mounted}
						<div class="spinner">
							<div class="cube1" />
							<div class="cube2" />
						</div>
					{:else}
						<TopBar {user} {isDark} />
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
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>
