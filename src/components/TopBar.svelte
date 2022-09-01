<script>
	export let user;
	export let isDark;
	const toggle = () => {
		// localStorage.setItem('theme', isDark ? 'light' : 'dark');
		const d = new Date();
		d.setTime(d.getTime() + (365*24*60*60*1000));
		document.cookie = `theme=${isDark ? 'light' : 'dark'}; expires=${d.toUTCString()}; path=/`
		window.location = window.location;
	};
</script>

<div class="bg-white dark:bg-slate-700 my-8 p-4 rounded-xl shadow-sm">
	<div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:mx-8">
		<div>
			<a href="/" class="flex justify-center md:justify-start">
				<img src="/logo.png" class="h-8" alt="Discord Tickets" />
			</a>
		</div>
		<div>
			<div
				class="w-64 flex-shrink-0 md:mx-0 mx-auto text-center md:text-left md:float-right flex items-center justify-center md:justify-end"
			>
				<a
					href="/auth/logout"
					class="flex items-center justify-center md:justify-end hover:font-medium"
					title="Logout"
				>
					<img src={user.avatar} class="h-8 rounded-full" alt="Discord Tickets" />
					<span class="ml-3">{user.username}</span>
				</a>
				<div class="ml-4">
					{#if isDark}
						<i
							class="fa-solid fa-moon text-lg p-1 cursor-pointer hover:text-blurple transition duration-300"
							title="Switch to light mode"
							on:click={() => toggle()}
						/>
					{:else}
						<i
							class="fa-solid fa-sun text-lg p-1 cursor-pointer hover:text-blurple transition duration-300"
							title="Switch to dark mode"
							on:click={() => toggle()}
						/>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>
