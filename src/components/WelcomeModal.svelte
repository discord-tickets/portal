<script>
	import { preventDefault } from 'svelte/legacy';

	import { fly } from 'svelte/transition';
	import { onBeforeClose } from 'svelte-modals';
	import cookie from 'cookie';
	import ms from 'ms';
	/** @type {{isOpen: any, client: any}} */
	let { isOpen, close, client } = $props();

	let allowClose = $state(false);
	onBeforeClose(() => allowClose);
</script>

{#if isOpen}
	<div
		role="dialog"
		class="modal mx-auto my-4 max-w-lg sm:my-12 md:my-24 lg:my-32"
		transition:fly|global={{ y: 50 }}
	>
		<div
			class="pointer-events-auto max-h-full w-full overflow-y-auto rounded-xl bg-white p-4 text-gray-800 shadow-sm dark:bg-slate-700 dark:text-slate-300"
		>
			<form onsubmit={preventDefault(() => {})} id="questionOptions" name="questionOptions">
				<div class="m-2 flex flex-col gap-6 sm:m-4">
					<div class="text-center">
						<h2 class="text-3xl font-bold">Getting started</h2>
						<!-- <h4
							class="italic leading-tight text-lg font-semibold text-gray-500 dark:text-slate-400"
						>
							Before you begin...
						</h4> -->
					</div>

					<div class="flex flex-col gap-8">
						<div class="flex flex-col gap-2">
							<h4 class="text-center text-xl font-semibold leading-tight">
								Say hello to your new bot
							</h4>
							<div
								class="flex items-center justify-center gap-4 rounded-xl bg-gray-100 p-4 font-semibold shadow-sm dark:bg-slate-800"
							>
								<img src={client.avatar} alt="" class="h-10 rounded-full" />
								<span class="text-xl font-bold">
									{client.username}<span class="text-gray-500 dark:text-slate-400"
										>#{client.discriminator}</span
									>
								</span>
							</div>
						</div>
						<!-- <hr class="border-gray-500 dark:border-slate-400 mx-12"> -->
						<div class="flex flex-col gap-2">
							<h4 class="text-center text-xl font-semibold leading-tight">But before you begin</h4>
							<a
								href="https://lnk.earth/discord"
								target="_blank"
								rel="noopener noreferrer"
								class="link group rounded-xl bg-gray-100/50 p-4 dark:bg-slate-800/50"
							>
								<div class="flex items-center gap-2 md:gap-4">
									<div class="flex w-full items-center gap-4">
										<span
											class="select-none text-5xl font-bold text-gray-500 transition duration-300 group-hover:text-white dark:text-slate-400 dark:group-hover:text-white"
											>1.</span
										>
										<i class="fa-solid fa-user-group text-4xl"></i>
										<div class="w-full">
											<span class="text-lg font-semibold">
												Join the community
												<i
													class="fa-solid fa-arrow-up-right-from-square text-gray-500 transition duration-300 group-hover:text-white dark:text-slate-400 dark:group-hover:text-white"
												></i>
											</span>
											<div
												class="text-sm font-medium text-gray-500 transition duration-300 group-hover:text-white dark:text-slate-400 dark:group-hover:text-white"
											>
												Join the Planet Earth Discord server to ask questions, get notified about
												updates, vote on polls, or just chat.
											</div>
										</div>
									</div>
								</div>
							</a>
							<a
								href="https://discordtickets.app/configuration/"
								target="_blank"
								rel="noopener noreferrer"
								class="link group rounded-xl bg-gray-100/50 p-4 dark:bg-slate-800/50"
							>
								<div class="flex items-center gap-2 md:gap-4">
									<div class="flex w-full items-center gap-4">
										<span
											class="select-none text-5xl font-bold text-gray-500 transition duration-300 group-hover:text-white dark:text-slate-400 dark:group-hover:text-white"
											>2.</span
										>
										<i class="fa-solid fa-person-chalkboard text-4xl"></i>
										<div class="w-full">
											<span class="text-lg font-semibold">
												Follow the guide
												<i
													class="fa-solid fa-arrow-up-right-from-square text-gray-500 transition duration-300 group-hover:text-white dark:text-slate-400 dark:group-hover:text-white"
												></i>
											</span>
											<div
												class="text-sm font-medium text-gray-500 transition duration-300 group-hover:text-white dark:text-slate-400 dark:group-hover:text-white"
											>
												Read the documentation so you know exactly what to do and avoid time-wasting
												mistakes.
											</div>
										</div>
									</div>
								</div>
							</a>
							<!-- <a
								href="https://lnk.earth/dsctickets-survey"
								target="_blank"
								rel="noopener noreferrer"
								class="bg-gray-100/50 dark:bg-slate-800/50 border-4 border-blurple p-4 rounded-xl group link"
							>
								<div class="flex items-center gap-2 md:gap-4">
									<div class="w-full flex items-center gap-4">
										<span
											class="select-none font-bold text-5xl text-blurple group-hover:text-white dark:group-hover:text-white transition duration-300"
											>2.</span
										>
										<i class="fa-solid fa-square-poll-vertical text-3xl" />
										<div class="w-full">
											<span class="text-lg font-semibold">
												Complete a quick survey
												<i
													class="fa-solid fa-arrow-up-right-from-square text-gray-500 dark:text-slate-400 group-hover:text-white dark:group-hover:text-white transition duration-300"
												/>
											</span>
											<div
												class="text-sm text-gray-500 dark:text-slate-400 group-hover:text-white dark:group-hover:text-white transition duration-300 font-medium"
											>
												Please take a few minutes to help us better understand how the bot is used.
												<span class="font-bold">Respondents can win a £4 Steam gift card.</span>
											</div>
										</div>
									</div>
								</div>
							</a> -->
						</div>
					</div>
					<div class="flex justify-center gap-8">
						<button
							class="rounded-lg bg-gray-100 p-2 px-5 font-semibold text-blurple transition duration-300 hover:bg-blurple hover:text-white disabled:cursor-not-allowed dark:bg-slate-800 dark:hover:bg-blurple dark:hover:text-white"
							onclick={() => {
								allowClose = true;
								document.cookie = cookie.serialize('welcomed', 'true', {
									maxAge: ms('1y') / 1000,
									path: '/',
									sameSite: 'lax'
								});
								close();
							}}
						>
							Start
							<i class="fa-solid fa-arrow-right"></i>
						</button>
					</div>
				</div>
			</form>
		</div>
	</div>
{/if}
