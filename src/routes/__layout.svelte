<script>
	import { onMount } from 'svelte';
	let isDark = false;

	onMount(() => {
		isDark =
			localStorage.theme === 'dark' ||
			(!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
	});
</script>

<div class={isDark ? 'dark' : ''}>
	<div class="bg-gray-200 dark:bg-slate-900 min-h-screen h-max w-full absolute">
		<div class="m-2 sm:mx-12 sm:my-8 md:mx-24 lg:mx-32 2xl:mx-72">
			<div class="text-gray-800 dark:text-slate-300">
				<slot />
				<footer class="text-center my-12">
					<p>
						<a href="https://discordtickets.app" target="_blank" class="hover:underline">Discord Tickets</a>
						by
						<a href="https://eartharoid.me" target="_blank" class="hover:underline">eartharoid&trade;</a>
						
					</p>
					<p>
						<i class="fa-solid fa-copyright" /> {new Date().getFullYear()}
						<a href="https://eartharoid.me" target="_blank" class="hover:underline">Isaac Saunders</a>
					</p>
					<p class="my-4">
						<a href="https://lnk.earth/discord" target="_blank" class="hover:text-blurple text-lg transition duration-300">
								<i class="fab fa-discord"/>
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
