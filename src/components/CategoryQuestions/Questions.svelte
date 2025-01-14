<script>
	import { run } from 'svelte/legacy';

	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import Sortable from 'sortablejs';
	import TextQuestion from './TextQuestion.svelte';
	import MenuQuestion from './MenuQuestion.svelte';
	import Required from '../Required.svelte';
	import { questionsState as qS } from '../state.svelte.js';

	let loading = $state({});
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
				get: () => {
					const order = qS.questions.sort((a, b) => a.order - b.order);
					return order;
				},
				set: (sortable) => {
					const order = sortable.toArray();
					order.forEach((id, i) => (qS.questions.find((q) => q.id === id).order = i));
				}
			}
		});
	});

	const del = async (q) => {
		if (q._real !== false) {
			const confirmed = confirm('Are you sure? This will delete all responses.');
			if (!confirmed) return false;
			loading[q.id] = true;
			const url = `/api/admin/guilds/${$page.params.guild}/categories/${$page.params.category}/questions/${q.id}`;
			const response = await fetch(url, {
				credentials: 'include',
				method: 'DELETE'
			});
			loading[q.id] = false;
			if (!response.ok) {
				const body = await response.json();
				console.log(body);
				return;
			}
		}
		const i = qS.questions.findIndex((x) => q.id === x.id);
		qS.questions.splice(i, 1);
		loading = false;
	};
</script>

<div bind:this={list} class="list-group flex flex-col gap-2">
	{#each qS.questions as q, i}
		<div data-id={q.id} class="list-group-item rounded-xl bg-gray-100/50 p-4 dark:bg-slate-800/50">
			<div class="w-full">
				<div class="flex items-center gap-2 md:gap-4">
					<i class="handle fa-solid fa-grip-vertical cursor-move text-gray-500 dark:text-slate-400"
					></i>

					<div class="w-full">
						{q.label}
						<button
							type="button"
							disabled={loading[q.id]}
							class="text-red-300 transition duration-300 hover:text-red-500 disabled:cursor-not-allowed dark:text-red-500/50 dark:hover:text-red-500"
							title="Remove"
							onclick={() => del(q)}
						>
							{#if loading[q.id]}
								<i class="fa-solid fa-spinner animate-spin"></i>
							{:else}
								<i class="fa-solid fa-xmark"></i>
							{/if}
						</button>
						<button
							type="button"
							class="flex w-full cursor-pointer select-none justify-between font-medium text-gray-500 transition duration-300 hover:text-blurple dark:text-slate-400 dark:hover:text-blurple"
							onclick={() => (expanded = expanded === q.id ? null : q.id)}
						>
							<span class="text-sm"> Click to {expanded === q.id ? 'collapse' : 'expand'}</span>
							<i
								class="fa-solid {expanded === q.id
									? 'fa-angle-up'
									: 'fa-angle-down'} self-end text-xl"
							></i>
						</button>
					</div>
				</div>
				{#if expanded === q.id}
					<div class="my-4 text-sm">
						<div class="grid grid-cols-1 gap-3">
							<div>
								<label class="font-medium">
									Type
									<Required />
									<i
										class="fa-solid fa-circle-question cursor-help text-gray-500 dark:text-slate-400"
										title="What type of input should the question use?"
									></i>
									<select
										class="input form-multiselect text-sm"
										required
										bind:value={q.type}
										onchange={() => {
											if (q.type === 'TEXT') q.maxLength = 1000;
											else if (q.type === 'MENU') q.maxLength = 1;
										}}
									>
										<option value={null} class="p-1" default disabled>Select an input type</option>
										<option value="TEXT" class="p-1"> Text </option>
										<option
											value="MENU"
											class="p-1"
											disabled
											title="Disabled until supported by Discord"
										>
											Select menu
										</option>
									</select>
								</label>
							</div>

							{#if q.type === 'TEXT'}
								<TextQuestion bind:question={qS.questions[i]} />
							{:else if q.type === 'MENU'}
								<MenuQuestion bind:question={qS.questions[i]} />
							{/if}
						</div>
					</div>
				{/if}
			</div>
		</div>
	{/each}
</div>
