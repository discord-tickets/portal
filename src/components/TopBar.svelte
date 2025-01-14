<script>
	import { base } from '$app/paths';
	import cookie from 'cookie';
	import ms from 'ms';
	/** @type {{user: any, isDark: any}} */
	let { user, theme } = $props();

	const toggle = () => {
		document.cookie = cookie.serialize('theme', theme === 'dark' ? 'light' : 'dark', {
			maxAge: ms('1y') / 1000,
			path: '/',
			sameSite: 'lax'
		});
		window.location = window.location; // eslint-disable-line
	};
</script>

<div class="my-8 rounded-xl bg-white p-4 shadow-sm dark:bg-slate-700">
	<div class="grid grid-cols-1 gap-4 sm:mx-8 md:grid-cols-2">
		<div>
			<a href={base + '/settings'} class="flex justify-center md:justify-start">
				<!-- <img src="/logo.png" class="h-8" alt="Discord Tickets" /> -->
				<img src="/assets/wordmark-{theme}.png" class="h-8" alt="Discord Tickets" />
			</a>
		</div>
		<div>
			<div
				class="mx-auto flex w-64 flex-shrink-0 items-center justify-center text-center md:float-right md:mx-0 md:justify-end md:text-left"
			>
				<a
					href={`/auth/logout`}
					class="flex items-center justify-center hover:font-medium md:justify-end"
					title="Logout"
				>
					<img
						src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.webp`}
						class="h-8 rounded-full"
						alt="Discord Tickets"
					/>
					<span class="ml-3">{user.username}</span>
				</a>
				<div class="ml-4">
					{#if theme === 'dark'}
						<i
							class="fa-solid fa-moon cursor-pointer p-1 text-lg transition duration-300 hover:text-blurple"
							title="Switch to light mode"
							onclick={() => toggle()}
						></i>
					{:else}
						<i
							class="fa-solid fa-sun cursor-pointer p-1 text-lg transition duration-300 hover:text-blurple"
							title="Switch to dark mode"
							onclick={() => toggle()}
						></i>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>
