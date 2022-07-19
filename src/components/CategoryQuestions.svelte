<script>
	export let state;
	import { onMount } from 'svelte';
	import Sortable from 'sortablejs';
	let expanded = null;
	let list;
	onMount(() => {
		let sortable = Sortable.create(list, {
			animation: 300,
			handle: '.handle',
			dragClass: 'dragged',
			swapThreshold: 0.5,
			dataIdAttr: 'data-id',
			store: {
				get: (sortable) => {
					const order = state.sort((a, b) => a.order - b.order);
					console.log(order);
					return order;
				},
				set: (sortable) => {
					console.log('state', state);
					const order = sortable.toArray();
					order.forEach((id, i) => (state.find((q) => q._id === Number(id)).order = i));
					state = state;
				}
			}
		});
	});
	$: state = state;
</script>

<div bind:this={list} class="list-group flex flex-col gap-2">
	{#each state as q}
		<div
			data-id={q._id}
			class="list-group-item bg-gray-100/50 dark:bg-slate-800/50 p-4 rounded-xl flex items-center gap-2 md:gap-4"
		>
			<i class="handle fa-solid fa-grip-vertical text-gray-500 dark:text-slate-400 cursor-move" />
			<div class="w-full">
				{q.label}
				<button
					type="button"
					disabled={false}
					class="text-red-300 hover:text-red-500 dark:text-red-500/20 dark:hover:text-red-500 transition duration-300 disabled:cursor-not-allowed"
					title="Delete"
				>
					<i class="fa-solid fa-trash" />
				</button>
				<div
					class="select-none text-gray-500 dark:text-slate-400 hover:text-blurple dark:hover:text-blurple cursor-pointer transition duration-300 font-medium flex justify-between"
					on:click={() => (expanded = expanded === q._id ? null : q._id)}
				>
					<span class="text-sm"> Click to {expanded === q._id ? 'collapse' : 'expand'}</span>
					<i
						class="fa-solid {expanded === q._id ? 'fa-angle-up' : 'fa-angle-down'} text-xl self-end"
					/>
				</div>
				{#if expanded === q._id}
					<div class="my-4 text-sm">
						<div class="grid grid-cols-1 gap-3">
							<div>
								<label class="font-medium">
									Label
									<i
										class="fa-solid fa-circle-question text-gray-500 dark:text-slate-400 cursor-help"
										title="The title of the question"
									/>
									<input
										type="text"
										class="form-input input text-sm"
										required
										maxlength="45"
										bind:value={q.label}
									/>
								</label>
							</div>
							<div>
								<label class="font-medium">
									Maximum length
									<i
										class="fa-solid fa-circle-question text-gray-500 dark:text-slate-400 cursor-help"
										title="The maximum input length"
									/>
									<input
										type="number"
										class="form-input input text-sm"
										required
										min="1"
										max="4000"
										bind:value={q.maxLength}
									/>
								</label>
							</div>
							<div>
								<label class="font-medium">
									Minimum length
									<i
										class="fa-solid fa-circle-question text-gray-500 dark:text-slate-400 cursor-help"
										title="The minimum input length"
									/>
									<input
										type="number"
										class="form-input input text-sm"
										required
										min="0"
										max="4000"
										bind:value={q.minLength}
									/>
								</label>
							</div>
							<div>
								<label class="font-medium">
									Placeholder
									<i
										class="fa-solid fa-circle-question text-gray-500 dark:text-slate-400 cursor-help"
										title="The placeholder value, such as a hint"
									/>
									<input
										type="text"
										class="form-input input text-sm"
										required
										maxlength="100"
										bind:value={q.placeholder}
									/>
								</label>
							</div>
							<div>
								<label for="required">
									Required
									<i
										class="fa-solid fa-circle-question text-gray-500 dark:text-slate-400 cursor-help"
										title="Require input?"
									/>
									<input
										type="checkbox"
										id="required"
										name="required"
										class="form-checkbox"
										bind:checked={q.required}
									/>
								</label>
							</div>
							<div>
								<label>
									Style
									<i
										class="fa-solid fa-circle-question text-gray-500 dark:text-slate-400 cursor-help"
										title="How big should the input box be?"
									/>
									<select class="form-multiselect input" required bind:value={q.style}>
										<option value={1} class="p-1">
											<i class="fa-solid fa-hashtag text-gray-500 dark:text-slate-400" />
											Short (single-line)
										</option>
										<option value={2} class="p-1">
											<i class="fa-solid fa-hashtag text-gray-500 dark:text-slate-400" />
											Long (multi-line)
										</option>
									</select>
								</label>
							</div>
							<div>
								<label class="font-medium">
									Value
									<i
										class="fa-solid fa-circle-question text-gray-500 dark:text-slate-400 cursor-help"
										title="A pre-filled value, use for answer templates/models etc"
									/>
									<textarea
										class="form-input input text-sm"
										required
										maxlength="4000"
										bind:value={q.value}
									/>
								</label>
							</div>
						</div>
					</div>
				{/if}
			</div>
		</div>
	{/each}
</div>
