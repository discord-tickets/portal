<!--
TODO: use modal props and close return data

 <script>
	import { preventDefault } from 'svelte/legacy';

	import { fly } from 'svelte/transition';
	import { modals, onBeforeClose } from 'svelte-modals';
	import { questionsStore } from './store';
	import { onMount } from 'svelte';
	import Sortable from 'sortablejs';
	import emoji from 'emoji-name-map';
	import { v4 as uuidv4 } from 'uuid';
	import Required from '../Required.svelte';
	/** @type {{isOpen: any, id: any}} */
	let { isOpen, id } = $props();

	const qIndex = $questionsStore.findIndex((v) => v.id === id);
	const q = $state($questionsStore[qIndex]);

	onBeforeClose(() => {
		const temp = $questionsStore;
		temp[qIndex] = q;
		questionsStore.set(temp);
		return true;
	});

	let expanded = $state(null);
	let list = $state();
	onMount(() => {
		Sortable.create(list, {
			animation: 300,
			handle: '.handle',
			dragClass: 'dragged',
			swapThreshold: 0.5,
			dataIdAttr: 'data-id',
			store: {
				set: (sortable) => {
					const temp = [];
					const order = sortable.toArray();
					order.forEach((id, i) => (temp[i] = q.options.find((q) => q.id === id)));
					q.options = temp;
				}
			}
		});
	});
</script>

{#if isOpen}
	<div
		role="dialog"
		class="modal my-4 sm:my-12 md:my-24 lg:my-32 max-w-lg mx-auto"
		transition:fly|global={{ y: 50 }}
	>
		<div
			class="pointer-events-auto bg-white dark:bg-slate-700 text-gray-800 dark:text-slate-300 p-4 rounded-xl shadow-sm w-full max-h-full overflow-y-auto"
		>
			<form onsubmit={preventDefault(() => {})} id="questionOptions" name="questionOptions">
				<div class="m-2 sm:m-4 flex flex-col gap-6">
					<div class="flex items-center gap-5">
						<i class="fa-regular fa-rectangle-list text-4xl"></i>
						<div>
							<h3 class="leading-tight text-2xl font-bold">{q.label}</h3>
							<h4 class="leading-tight text-lg font-semibold text-gray-500 dark:text-slate-400">
								Options
							</h4>
						</div>
					</div>
					<div bind:this={list} class="list-group flex flex-col gap-2">
						{#each q.options as o}
							<div
								data-id={o.id}
								class="list-group-item bg-gray-100/50 dark:bg-slate-800/50 p-4 rounded-xl"
							>
								<div class="w-full">
									<div class="flex items-center gap-2 md:gap-4">
										<i
											class="handle fa-solid fa-grip-vertical text-gray-500 dark:text-slate-400 cursor-move"
										></i>

										<div class="w-full flex items-center gap-4">
											{#if emoji.get(o.emoji)}
												<span class="text-3xl">{emoji.get(o.emoji)}</span>
											{/if}
											<div class="w-full">
												{o.label}
												<button
													type="button"
													class="text-red-300 hover:text-red-500 dark:text-red-500/50 dark:hover:text-red-500 transition duration-300 disabled:cursor-not-allowed"
													title="Remove"
													onclick={() => {
														const i = q.options.findIndex((x) => o.id === x.id);
														q.options.splice(i, 1);
														q.options = q.options;
													}}
												>
													<i class="fa-solid fa-xmark"></i>
												</button>
												<div
													class="select-none text-gray-500 dark:text-slate-400 hover:text-blurple dark:hover:text-blurple cursor-pointer transition duration-300 font-medium flex justify-between"
													onclick={() => (expanded = expanded === o.id ? null : o.id)}
												>
													<span class="text-sm">
														Click to {expanded === o.id ? 'collapse' : 'expand'}</span
													>
													<i
														class="fa-solid {expanded === o.id
															? 'fa-angle-up'
															: 'fa-angle-down'} text-xl self-end"
													></i>
												</div>
											</div>
										</div>
									</div>
									{#if expanded === o.id}
										<div>
											<label class="font-medium">
												Label
												<Required />
												<i
													class="fa-solid fa-circle-question text-gray-500 dark:text-slate-400 cursor-help"
													title="The name of the option"
												></i>
												<input
													type="text"
													class="form-input input text-sm"
													required
													maxlength="100"
													bind:value={o.label}
												/>
											</label>
										</div>
										<div>
											<label class="font-medium">
												Description
												<i
													class="fa-solid fa-circle-question text-gray-500 dark:text-slate-400 cursor-help"
													title="The description of the option"
												></i>
												<input
													type="text"
													class="form-input input text-sm"
													maxlength="100"
													bind:value={o.description}
												/>
											</label>
										</div>
										<div>
											<label class="font-medium">
												Emoji
												<i
													class="fa-solid fa-circle-question text-gray-500 dark:text-slate-400 cursor-help"
													title="A default emoji name, or custom emoji ID"
												></i>
												<span class="text-2xl">{emoji.get(o.emoji) ?? ''}</span>
												<input
													type="text"
													class="form-input input text-sm"
													maxlength="100"
													bind:value={o.emoji}
												/>
											</label>
										</div>
										<div>
											<label class="font-medium">
												Value
												<Required />
												<i
													class="fa-solid fa-circle-question text-gray-500 dark:text-slate-400 cursor-help"
													title="The value of this option (the text stored and used in placeholders)"
												></i>
												<input
													type="text"
													class="form-input input text-sm"
													required
													maxlength="100"
													bind:value={o.value}
												/>
											</label>
										</div>
									{/if}
								</div>
							</div>
						{/each}
					</div>
					{#if q.options.length < 25}
						<div class="text-center">
							<button
								type="button"
								class="hover:text-green-300 text-green-500 dark:hover:text-green-500/50 dark:text-green-500 p-2 px-5 rounded-lg font-medium transition duration-300 disabled:cursor-not-allowed"
								onclick={() => {
									q.options.push({
										id: uuidv4(),
										description: '',
										emoji: '',
										label: `Option ${q.options.length + 1}`,
										value: ''
									});
									q.options = q.options;
								}}
							>
								<i class="fa-solid fa-circle-plus"></i>
								Add
							</button>
						</div>
					{/if}
				</div>
				<div class="flex justify-end gap-8 m-2">
					<button
						type="submit"
						form="questionOptions"
						class="bg-green-300 hover:bg-green-500 hover:text-white dark:bg-green-500/75 dark:hover:bg-green-500 dark:hover:text-white p-2 px-5 rounded-lg font-medium transition duration-300 disabled:cursor-not-allowed"
						onclick={() => close(DATA)}
					>
						<i class="fa-solid fa-check"></i>
						Save
					</button>
				</div>
			</form>
		</div>
	</div>
{/if} -->
