<script>
	import { I18nLite } from '@eartharoid/i18n';
	/** @type {{data: import('./$types').PageData}} */
	let { data } = $props();
	const { client, translations, query } = data;
	const i18n = new I18nLite();
	const t = i18n.loadParsed(...translations).createTranslator();
</script>

<svelte:head>
	<title>{t('login_title', { username: client.username })}</title>
	<link rel="icon" href={`${client.avatar}?size=32`} />
</svelte:head>

<div class="flex flex-col gap-0 lg:flex-row">
	<div class="bg-dgrey-400 dark:bg-dgrey-950 lg:min-h-screen lg:w-1/2">
		<div class="flex justify-center p-8 lg:min-h-screen">
			<div class="flex items-center gap-8">
				<img src={`${client.avatar}?size=512`} alt="" class="h-24 w-24 rounded-full" />
				<h1 class="text-2xl font-bold lg:text-4xl">{client.username}</h1>
			</div>
			<p
				class="m-0 hidden p-0 text-center text-6xl font-black tracking-wide text-dgrey-100 dark:text-dgrey-800 lg:absolute lg:bottom-10 lg:inline lg:text-left lg:text-8xl"
			>
				Portal
			</p>
		</div>
	</div>
	<div class="lg:w-1/2">
		<div class="flex items-center justify-stretch p-8 lg:min-h-screen">
			<div class="flex w-full flex-col items-center gap-4">
				<div class="text-lg font-semibold">
					{t('please_login')}
				</div>
				<a
					href={'/auth/login' + query}
					class="rounded-lg border-2 border-white/50 bg-blurple p-2 px-5 font-semibold text-white ring-blurple transition duration-300 hover:bg-blurple/75 focus:outline-none focus:ring-2 dark:border-white/25"
				>
					<span class="flex flex-row items-center gap-2">
						<i class="fa-brands fa-discord"></i>
						{t('continue_with_discord')}
					</span>
				</a>
			</div>
		</div>
	</div>
</div>
