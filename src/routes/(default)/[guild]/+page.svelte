<script>
	/** @type {import('./$types').PageData} */
	export let data;

	import { page } from '$app/stores';
	import { I18nLite } from '@eartharoid/i18n';
	const { client, guild, translations } = data;
	const i18n = new I18nLite();
	const t = i18n.loadParsed(...translations).createTranslator();
</script>

<svelte:head>
	<title>{t('common:title', { guild: guild.name, client: client.username })}</title>
</svelte:head>

<div>
	{#if guild.privilegeLevel > 0}
		<!-- text-dgrey-600/75 -->
		<div class="bg-dgrey-400 dark:bg-dgrey-950 p-1 w-full text-xs">
			<div class="container mx-auto">
				<div class="flex justify-center gap-8">
					<!-- short slug-id from url -->
					<!-- underline decoration-dotted hover:decoration-solid -->
					<a
						href={`/${$page.params.guild}/staff`}
						class="py-1 px-2 bg-dgrey-900/10 hover:bg-dgrey-900/20 dark:bg-dgrey-400/10 dark:hover:bg-dgrey-400/20 dark:text-dgrey-400/75 hover:dark:text-dgrey-400/100 duration-300 rounded-md"
					>
						<div class="flex items-center gap-2">
							<i class="fa-solid fa-user-group"></i>
							{t('common:staff_dashboard')}
						</div>
					</a>
					{#if guild.privilegeLevel >= 2}
						<!-- real id from guild -->
						<a
							href={`/settings/${guild.id}`}
							class="py-1 px-2 bg-dgrey-900/10 hover:bg-dgrey-900/20 dark:bg-dgrey-400/10 dark:hover:bg-dgrey-400/20 dark:text-dgrey-400/75 hover:dark:text-dgrey-400/100 duration-300 rounded-md"
						>
							<div class="flex items-center gap-2">
								<i class="fa-solid fa-gear"></i>
								{t('common:settings_panel')}
							</div>
						</a>
					{/if}
				</div>
			</div>
		</div>
	{/if}
</div>
