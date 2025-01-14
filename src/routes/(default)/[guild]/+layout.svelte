<script>
	/** @type {{data: import('./$types').PageData, children?: import('svelte').Snippet}} */
	let { data, children } = $props();

	const { guild } = data;
</script>

<svelte:head>
	<link rel="icon" href={`${guild.logo}`} />
</svelte:head>

<div>
	{@render children?.()}
</div>
