<script>
	import { getContext } from 'svelte';
	export let data;

	import { I18nLite } from '@eartharoid/i18n';
	const { client, translations, query } = data;
	const i18n = new I18nLite();
	const t = i18n.loadParsed(...translations).createTranslator();

	let theme = getContext('theme');
</script>

<svelte:head>
	<title>{t('login_title', { username: client.username })}</title>
	<link rel="icon" href={`${client.avatar}?size=32`} />
</svelte:head>

<div
	class="min-h-screen bg-cover bg-no-repeat"
	style={`background-image: url("/assets/topgg-${theme}.png")`}
>
	<div
		class="min-h-screen bg-gradient-to-bl from-blurple/50 to-white/10 dark:from-blurple/25 dark:to-blurple/5"
	>
		<div class="flex flex-col lg:flex-row gap-0 backdrop-blur-sm">
			<div class="lg:w-1/2 lg:min-h-screen">
				<!-- bg-dgrey-400 dark:bg-dgrey-950 -->
				<div class="flex justify-center lg:min-h-screen p-8">
					<div class="flex items-center gap-8">
						<img src={`${client.avatar}?size=512`} alt="" class="rounded-full h-24 w-24" />
						<h1 class="font-bold text-2xl lg:text-4xl">{client.username}</h1>
					</div>
				</div>
			</div>
			<div class="lg:w-1/2">
				<div class="flex items-center justify-center lg:justify-stretch lg:min-h-screen">
					<div class="bg-dgrey-100 dark:bg-dgrey-900 m-4 rounded-lg shadow-2xl">
						<div class="flex flex-col items-center gap-6 p-8 sm:p-12">
							<div class="text-lg font-semibold">
								{t('please_login')}
							</div>
							<a
								href={'/auth/login' + query}
								class="bg-blurple hover:bg-blurple/75 text-white p-2 px-5 rounded-lg font-semibold transition duration-300 focus:outline-none border-2 border-white/50 dark:border-white/25 focus:ring-2 ring-blurple"
							>
								<span class="flex flex-row items-center gap-2">
									<i class="fa-brands fa-discord"></i>
									{t('continue_with_discord')}
								</span>
							</a>
						</div>
						<div
							class="bg-dgrey-400 dark:bg-dgrey-950 p-1.5 rounded-b-lg text-xs dark:text-dgrey-400/75"
						>
							<div class="flex justify-evenly">
								<!-- py-1 px-2 text-dgrey-700 bg-dgrey-900/10 hover:bg-dgrey-900/20 dark:bg-dgrey-400/10 dark:hover:bg-dgrey-400/20 dark:text-dgrey-400/75 hover:dark:text-dgrey-400/100 duration-300 rounded-md -->
								<div
									class=""
								>
									<div class="flex items-center gap-2">
										<i class="fa-solid fa-globe" />
										{t('common:language')}
									</div>
								</div>

								<div
									class=""
								>
									<div class="flex items-center gap-2">
										<i class="fa-solid {theme === 'dark' ? 'fa-moon' : 'fa-sun'}" />
										{t('common:theme')}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
