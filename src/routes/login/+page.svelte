<script>
	/** @type {import('./$types').PageData} */
	export let data;

	import { I18nLite } from '@eartharoid/i18n';
	const { client, theme, translations } = data;
	// const i18n = new I18nLite();
	// const t = i18n.loadParsed(...translations).createTranslator();
</script>

<svelte:head>
	<title>{client.username}</title>
	<link rel="icon" href={`${client.avatar}?size=32`} />
</svelte:head>

<div class={theme}>
	<div
		class="bg-dgrey-100 dark:bg-dgrey-800 text-dgrey-600 dark:text-dgrey-300 min-h-screen h-max w-full absolute"
	>
		<div class="flex flex-col lg:flex-row gap-0">
			<div class="lg:w-1/2 bg-dgrey-950">...</div>
			<div>...</div>
		</div>
	</div>
</div>
