<script>
	export let user;
</script>

<div class="bg-white dark:bg-slate-700 my-8 p-4 rounded-xl shadow-sm">
	<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
		<div>
			<a href="/" class="flex justify-center md:justify-start">
				<img src="/logo.png" class="h-8" alt="Discord Tickets" />
			</a>
		</div>
		<div>
			<div class="w-64 flex-shrink-0 md:mx-0 mx-auto text-center md:text-left md:float-right">
				<a href="/auth/logout" class="flex items-center justify-center md:justify-end" title="Logout">
					<img src={user.avatar} class="h-8 rounded-full" alt="Discord Tickets" />
					<span class="ml-3">{user.username}</span>
				</a>
			</div>
		</div>
	</div>
</div>
