<script>
	import { page } from '$app/stores';
	import { I18nLite } from '@eartharoid/i18n';
	/** @type {{data: import('./$types').PageData}} */
	let { data } = $props();
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
		<div class="w-full bg-dgrey-400 p-1 text-xs dark:bg-dgrey-950">
			<div class="container mx-auto">
				<div class="flex justify-center gap-8">
					<!-- underline decoration-dotted hover:decoration-solid -->
					<!-- short slug-id from url -->
					<a
						href={`/${$page.params.guild}/staff`}
						class="rounded-md bg-dgrey-900/10 px-2 py-1 text-dgrey-700 duration-300 hover:bg-dgrey-900/20 dark:bg-dgrey-400/10 dark:text-dgrey-400/75 dark:hover:bg-dgrey-400/20 hover:dark:text-dgrey-400/100"
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
							class="rounded-md bg-dgrey-900/10 px-2 py-1 text-dgrey-700 duration-300 hover:bg-dgrey-900/20 dark:bg-dgrey-400/10 dark:text-dgrey-400/75 dark:hover:bg-dgrey-400/20 hover:dark:text-dgrey-400/100"
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
	<div>todo</div>
</div>
