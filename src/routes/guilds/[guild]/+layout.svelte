<script>
	export let data;

	const { guild } = data;
</script>

<div class="text-center">
	<a
		href={'/guilds/' + guild.id}
		class="bg-gray-50/75 dark:bg-slate-800/75 p-2 px-4 rounded-xl shadow-sm text-gray-500 dark:text-slate-400 font-medium inline-block link mb-4"
	>
		<i class="fa-solid fa-arrow-left" />
		{guild.name}
	</a>
</div>

<slot />
