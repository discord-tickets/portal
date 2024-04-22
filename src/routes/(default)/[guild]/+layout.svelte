<script>
	/** @type {import('./$types').PageData} */
	export let data;

	const { guild } = data;
</script>

<svelte:head>
	<link rel="icon" href={`${guild.logo}`} />
</svelte:head>

<div>
	<slot />
</div>
