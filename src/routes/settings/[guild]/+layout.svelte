<script>
	/** @type {{data: any, children?: import('svelte').Snippet}} */
	let { data, children } = $props();

	const { guild } = data;
</script>

<div class="text-center">
	<a
		href="./"
		class="bg-gray-50/75 dark:bg-slate-800/75 p-2 px-4 rounded-xl shadow-sm text-gray-500 dark:text-slate-400 font-medium inline-block link mb-4"
	>
		<i class="fa-solid fa-arrow-left"></i>
		{guild.name}
	</a>
</div>

{@render children?.()}
