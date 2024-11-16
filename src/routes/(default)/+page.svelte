<script>
	/** @type {import('./$types').PageData} */
	export let data;

	import { I18nLite } from '@eartharoid/i18n';
	const { client, guilds, translations } = data;
	const i18n = new I18nLite();
	const t = i18n.loadParsed(...translations).createTranslator();
</script>

<svelte:head>
	<title>{t('select_server_title', { username: client.username })}</title>
	<link rel="icon" href={`${client.avatar}?size=32`} />
</svelte:head>

<div
	class="bg-dgrey-100 dark:bg-dgrey-800 text-dgrey-600 dark:text-dgrey-300 min-h-screen h-max w-full absolute"
>
	<div class="container mx-auto text-center mt-24 sm:mt-48 p-4">
		<h1 class="text-2xl font-bold mb-16">
			{t('select_server')}
		</h1>
		<div class="flex flex-col sm:flex-row items-stretch justify-center gap-4 sm:gap-8 flex-wrap">
			{#each guilds as guild}
				{@const slug = BigInt(guild.id).toString(36)}
				<a href={`/${slug}`}>
					<div
						class="bg-dgrey-300 dark:bg-dgrey-900 border-2 border-dgrey-400 dark:border-dgrey-700 p-4 rounded-lg w-full sm:w-48 hover:shadow-2xl shadow-black hover:scale-105 transition-all duration-300 h-full"
					>
						<div class="flex flex-row sm:flex-col gap-4 items-center">
							<img
								src={guild.logo}
								alt=""
								class="rounded-full h-12 sm:h-24 w-12 sm:w-24 sm:mx-auto"
							/>
							<p class="font-semibold">{guild.name}</p>
						</div>
					</div>
				</a>
			{/each}
		</div>
		<div class="m-8 lg:my-24 text-sm">
			<a href="/auth/logout" class="hover:text-blurple transition-colors duration-300"
				>{t('common:logout')}</a
			>
		</div>
	</div>
</div>
