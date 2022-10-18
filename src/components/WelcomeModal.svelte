<script>
	export let isOpen;
	export let client;

	import { fly } from 'svelte/transition';
	import { closeModal, onBeforeClose } from 'svelte-modals';
	import ms from 'ms';

	let allowClose = false;
	onBeforeClose(() => allowClose);
</script>

{#if isOpen}
	<div
		role="dialog"
		class="modal my-4 sm:my-12 md:my-24 lg:my-32 max-w-lg mx-auto"
		transition:fly={{ y: 50 }}
		on:introstart
		on:outroend
	>
		<div
			class="pointer-events-auto bg-white dark:bg-slate-700 text-gray-800 dark:text-slate-300 p-4 rounded-xl shadow-sm w-full max-h-full overflow-y-auto"
		>
			<form on:submit|preventDefault={() => {}} id="questionOptions" name="questionOptions">
				<div class="m-2 sm:m-4 flex flex-col gap-6">
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
							<h4 class="text-center leading-tight text-xl font-semibold">
								Say hello to your new bot
							</h4>
							<div
								class="bg-gray-100 dark:bg-slate-800 p-4 rounded-xl shadow-sm flex items-center justify-center gap-4 font-semibold"
							>
								<img src={client.avatar} alt="" class="h-10 rounded-full" />
								<span class="font-bold text-xl">
									{client.username}<span class="text-gray-500 dark:text-slate-400"
										>#{client.discriminator}</span
									>
								</span>
							</div>
						</div>
						<!-- <hr class="border-gray-500 dark:border-slate-400 mx-12"> -->
						<div class="flex flex-col gap-2">
							<h4 class="text-center leading-tight text-xl font-semibold">But before you begin</h4>
							<a
								href="https://discordtickets.app"
								target="_blank"
								class="bg-gray-100/50 dark:bg-slate-800/50 p-4 rounded-xl group link"
							>
								<div class="flex items-center gap-2 md:gap-4">
									<div class="w-full flex items-center gap-4">
										<span
											class="select-none font-bold text-5xl text-gray-500 dark:text-slate-400 group-hover:text-white dark:group-hover:text-white transition duration-300"
											>1.</span
										>
										<i class="fa-solid fa-person-chalkboard text-4xl" />
										<div class="w-full">
											<span class="text-lg font-semibold">
												Follow the guide
												<i
													class="fa-solid fa-arrow-up-right-from-square text-gray-500 dark:text-slate-400 group-hover:text-white dark:group-hover:text-white transition duration-300"
												/>
											</span>
											<div
												class="text-sm text-gray-500 dark:text-slate-400 group-hover:text-white dark:group-hover:text-white transition duration-300 font-medium"
											>
												Read the documentation so you know exactly what to do and avoid time-wasting
												mistakes.
											</div>
										</div>
									</div>
								</div>
							</a>
							<a
								href="https://lnk.earth/dsctickets-survey"
								target="_blank"
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
												<!-- Please take a few minutes to answer some questions that help us better understand how the bot is used. -->
												Please take a few minutes to help us better understand how the bot is used.
												<span class="font-bold">Respondents can win a £4 Steam gift card.</span>
											</div>
										</div>
									</div>
								</div>
							</a>
						</div>
					</div>
					<div class="flex justify-center gap-8">
						<button
							class="bg-gray-100 dark:bg-slate-800 hover:bg-blurple dark:hover:bg-blurple text-blurple hover:text-white dark:hover:text-white p-2 px-5 rounded-lg font-semibold transition duration-300 disabled:cursor-not-allowed"
							on:click={() => {
								allowClose = true;
								document.cookie = `welcomed=true; max-age=${ms('1y') / 1000}; path=/`;
								closeModal();
							}}
						>
							Start
							<i class="fa-solid fa-arrow-right" />
						</button>
					</div>
				</div>
			</form>
		</div>
	</div>
{/if}
