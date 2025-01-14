<script>
	/** @type {{data: any, children?: import('svelte').Snippet}} */
	let { data, children } = $props();

	const { guild } = data;
</script>

<div class="text-center">
	<a
		href="./"
		class="link mb-4 inline-block rounded-xl bg-gray-50/75 p-2 px-4 font-medium text-gray-500 shadow-sm dark:bg-slate-800/75 dark:text-slate-400"
	>
		<i class="fa-solid fa-arrow-left"></i>
		{guild.name}
	</a>
</div>

{@render children?.()}
