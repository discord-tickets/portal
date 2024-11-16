<script>
	/** @type {import('./$types').PageData} */
	export let data;
	import TopBar from '$components/TopBar.svelte';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { page, navigating } from '$app/stores';
	import { Modals, closeModal } from 'svelte-modals';
	import cookie from 'cookie';
	import { openModal } from 'svelte-modals';
	import WelcomeModal from '$components/WelcomeModal.svelte';
	import Spinner from '$components/Spinner.svelte';

	const { client, user, theme } = data;
	let mounted = false;
	let cookies = {};
	onMount(() => {
		cookies = cookie.parse(document.cookie || '');
		if (!cookies.welcomed) openModal(WelcomeModal, { client });
		mounted = true;
	});

	const dismissCookies = () => {
		document.cookie = cookie.serialize('dismissedCookies', 'true', {
			maxAge: 2592000,
			path: '/',
			sameSite: 'lax'
		});
		cookies.dismissedCookies = true;
	};

	const links = [
		{
			icon: 'fa-solid fa-book',
			name: 'Documentation',
			url: 'https://discordtickets.app'
		},
		{
			icon: 'fab fa-discord',
			name: 'Support',
			url: 'https://lnk.earth/discord'
		},
		{
			icon: 'fa-solid fa-comments',
			name: 'Feedback',
			url: 'https://lnk.earth/dsctickets-feedback'
		}
	];
</script>

<svelte:head>
	<title>Discord Tickets</title>
	<link rel="icon" href="/favicon.png" />
</svelte:head>

<div class="bg-gray-200 dark:bg-slate-900 min-h-screen h-max w-full absolute">
	<Modals>
		<div
			slot="backdrop"
			class="backdrop"
			transition:fade
			on:click={closeModal}
			on:keypress={closeModal}
		/>
		<div slot="loading">
			<Spinner />
		</div>
	</Modals>
	{#if mounted && client.public && !cookies.dismissedCookies}
		<div
			class="bg-blurple text-white font-medium m-0 p-1 sm:px-8 flex flex-row justify-center gap-8 w-full"
		>
			<p>Cookies are being used to store credentials and preferences.</p>
			<p>
				<i
					class="fa-sharp fa-solid fa-circle-xmark justify-self-end hover:cursor-pointer"
					title="Dismiss"
					on:click={dismissCookies}
					on:keypress={dismissCookies}
				/>
			</p>
		</div>
	{/if}
	<div class="m-2 sm:m-6 lg:m-12">
		<div class="max-w-7xl mx-auto">
			<div class="text-gray-800 dark:text-slate-300">
				{#if $navigating || !mounted}
					<Spinner />
				{:else}
					<TopBar {user} {theme} />
					<slot />
					<footer class="text-center my-16">
						<div class="text-sm p-2 mb-6">
							<a
								href="/"
								class="text-gray-500 dark:text-slate-400 hover:text-blurple dark:hover:text-blurple cursor-pointer transition duration-300"
							>
								<i class="fa-solid fa-arrow-left" />
								Back to the portal
							</a>
						</div>
						{#if $page.route.id !== '/settings'}
							<div class="my-4 flex gap-3 justify-center">
								{#each links as link}
									<a
										href={link.url}
										target="_blank"
										rel="noopener noreferrer"
										class="bg-gray-50/75 dark:bg-slate-800/75 p-0.5 px-2 rounded-3xl shadow-sm text-gray-500 dark:text-slate-400 font-medium link"
									>
										<i class={link.icon} />
										{link.name}
									</a>
								{/each}
							</div>
						{/if}
						<p>
							<a
								href="https://discordtickets.app"
								target="_blank"
								rel="noopener noreferrer"
								class="hover:text-blurple dark:hover:text-blurple cursor-pointer transition duration-300"
								>Discord Tickets</a
							>
							by
							<a
								href="https://eartharoid.me"
								target="_blank"
								rel="noopener noreferrer"
								class="hover:text-blurple dark:hover:text-blurple cursor-pointer transition duration-300"
								>eartharoid&trade;</a
							>
						</p>
						<p>
							<i class="fa-solid fa-copyright" />
							{new Date().getFullYear()}
							<a
								href="https://eartharoid.me"
								target="_blank"
								class="hover:text-blurple dark:hover:text-blurple cursor-pointer transition duration-300"
								>Isaac Saunders</a
							>
						</p>
						<!-- <p class="my-4">
								<a
									href="https://lnk.earth/discord"
									target="_blank"
									class="hover:text-blurple text-lg transition duration-300"
								>
									<i class="fab fa-discord" />
								</a>
							</p> -->
						<p class="text-xs my-4">
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
