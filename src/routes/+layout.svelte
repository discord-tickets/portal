<script>
	/** @type {import('./$types').PageData} */
	export let data;

	import '../app.css';
	import '@fortawesome/fontawesome-free/css/all.css';

	const { client } = data;
</script>

<svelte:head>
	<title>{data.client.username}</title>
	<link rel="icon" href={`${client.avatar}?size=32`} />
</svelte:head>

<div>
	<slot />
</div>