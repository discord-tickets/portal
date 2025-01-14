<script>
	import { I18nLite } from '@eartharoid/i18n';
	/** @type {{data: import('./$types').PageData}} */
	let { data } = $props();
	const { client, guilds, translations } = data;
	const i18n = new I18nLite();
	const t = i18n.loadParsed(...translations).createTranslator();
</script>

<svelte:head>
	<title>{t('select_server_title', { username: client.username })}</title>
	<link rel="icon" href={`${client.avatar}?size=32`} />
</svelte:head>

<div
	class="absolute h-max min-h-screen w-full bg-dgrey-100 text-dgrey-600 dark:bg-dgrey-800 dark:text-dgrey-300"
>
	<div class="container mx-auto mt-24 p-4 text-center sm:mt-48">
		<h1 class="mb-16 text-2xl font-bold">
			{t('select_server')}
		</h1>
		<div class="flex flex-col flex-wrap items-stretch justify-center gap-4 sm:flex-row sm:gap-8">
			{#each guilds as guild}
				{@const slug = BigInt(guild.id).toString(36)}
				<a href={`/${slug}`}>
					<div
						class="h-full w-full rounded-lg border-2 border-dgrey-400 bg-dgrey-300 p-4 shadow-black transition-all duration-300 hover:scale-105 hover:shadow-2xl dark:border-dgrey-700 dark:bg-dgrey-900 sm:w-48"
					>
						<div class="flex flex-row items-center gap-4 sm:flex-col">
							<img
								src={guild.logo}
								alt=""
								class="h-12 w-12 rounded-full sm:mx-auto sm:h-24 sm:w-24"
							/>
							<p class="font-semibold">{guild.name}</p>
						</div>
					</div>
				</a>
			{/each}
		</div>
		<div class="m-8 text-sm lg:my-24">
			<a href="/auth/logout" class="transition-colors duration-300 hover:text-blurple"
				>{t('common:logout')}</a
			>
		</div>
	</div>
</div>
