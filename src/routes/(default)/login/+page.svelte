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

<div class="flex flex-col lg:flex-row gap-0">
	<div class="lg:w-1/2 bg-dgrey-400 dark:bg-dgrey-950 lg:min-h-screen">
		<div class="flex justify-center lg:min-h-screen p-8">
			<div class="flex items-center gap-8">
				<img src={`${client.avatar}?size=512`} alt="" class="rounded-full h-24 w-24" />
				<h1 class="font-bold text-2xl lg:text-4xl">{client.username}</h1>
			</div>
			<p
				class="hidden lg:inline text-dgrey-100 dark:text-dgrey-800 font-black text-6xl lg:text-8xl tracking-wide text-center lg:text-left lg:absolute lg:bottom-10 m-0 p-0 select-none"
			>
				Portal
			</p>
		</div>
	</div>
	<div
		class="lg:w-1/2 bg-cover bg-no-repeat"
		style={`background-image: url("/topgg-${theme}.png")`}
	>
		<div class="bg-gradient-to-br from-blurple/20 to-white/10 dark:to-[#090510]/10">
			<div class="flex items-center justify-stretch lg:min-h-screen p-8 backdrop-blur-sm">
				<div class="flex flex-col items-center gap-4 w-full">
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
			</div>
		</div>
	</div>
</div>
