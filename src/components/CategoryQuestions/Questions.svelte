<script>
	export let state;
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { env } from '$env/dynamic/public';
	import Sortable from 'sortablejs';
	import TextQuestion from './TextQuestion.svelte';
	import MenuQuestion from './MenuQuestion.svelte';
	import Required from '../Required.svelte';
	import { questionsStore } from './store';

	let loading = {};
	let expanded = null;
	let list;

	questionsStore.set(state);
	$: state = $questionsStore;

	onMount(() => {
		Sortable.create(list, {
			animation: 300,
			handle: '.handle',
			dragClass: 'dragged',
			swapThreshold: 0.5,
			dataIdAttr: 'data-id',
			store: {
				get: () => {
					const order = state.sort((a, b) => a.order - b.order);
					return order;
				},
				set: (sortable) => {
					const order = sortable.toArray();
					order.forEach((id, i) => (state.find((q) => q._id === id).order = i));
					state = state;
				}
			}
		});
	});

	const del = async (q) => {
		if (q.id) {
			const confirmed = confirm('Are you sure? This will delete all responses.');
			if (!confirmed) return false;
			loading[q.id] = true;
			const url = `${env.PUBLIC_HOST}/api/admin/guilds/${$page.params.guild}/categories/${$page.params.category}/questions/${q.id}`;
			const response = await fetch(url, {
				credentials: 'include',
				method: 'DELETE',
				headers: {
					'Content-type': 'application/json; charset=UTF-8'
				}
			});
			loading[q.id] = false;
			if (!response.ok) {
				const body = await response.json();
				console.log(body);
				return;
			}
		}
		const i = state.findIndex((x) => q._id === x._id);
		state.splice(i, 1);
		state = state;
		loading = false;
	};
</script>

<div bind:this={list} class="list-group flex flex-col gap-2">
	{#each state as q}
		<div data-id={q._id} class="list-group-item bg-gray-100/50 dark:bg-slate-800/50 p-4 rounded-xl">
			<div class="w-full">
				<div class="flex items-center gap-2 md:gap-4">
					<i
						class="handle fa-solid fa-grip-vertical text-gray-500 dark:text-slate-400 cursor-move"
					/>

					<div class="w-full">
						{q.label}
						<button
							type="button"
							disabled={loading[q.id]}
							class="text-red-300 hover:text-red-500 dark:text-red-500/50 dark:hover:text-red-500 transition duration-300 disabled:cursor-not-allowed"
							title="Remove"
							on:click={() => del(q)}
						>
							{#if loading[q.id]}
								<i class="fa-solid fa-spinner animate-spin" />
							{:else}
								<i class="fa-solid fa-xmark" />
							{/if}
						</button>
						<div
							class="select-none text-gray-500 dark:text-slate-400 hover:text-blurple dark:hover:text-blurple cursor-pointer transition duration-300 font-medium flex justify-between"
							on:click={() => (expanded = expanded === q._id ? null : q._id)}
						>
							<span class="text-sm"> Click to {expanded === q._id ? 'collapse' : 'expand'}</span>
							<i
								class="fa-solid {expanded === q._id
									? 'fa-angle-up'
									: 'fa-angle-down'} text-xl self-end"
							/>
						</div>
					</div>
				</div>
				{#if expanded === q._id}
					<div class="my-4 text-sm">
						<div class="grid grid-cols-1 gap-3">
							<div>
								<label class="font-medium">
									Type
									<Required />
									<i
										class="fa-solid fa-circle-question text-gray-500 dark:text-slate-400 cursor-help"
										title="What type of input should the question use?"
									/>
									<select
										class="form-multiselect input text-sm"
										required
										bind:value={q.type}
										on:change={() => {
											if (q.type === 'TEXT') q.maxLength = 1000;
											else if (q.type === 'MENU') q.maxLength = 1;
										}}
									>
										<option value={null} class="p-1" default disabled>Select an input type</option>
										<option value="TEXT" class="p-1"> Text </option>
										<option value="MENU" class="p-1"> Select menu </option>
									</select>
								</label>
							</div>

							{#if q.type === 'TEXT'}
								<TextQuestion bind:state={q} />
							{:else if q.type === 'MENU'}
								<MenuQuestion bind:state={q} />
							{/if}
						</div>
					</div>
				{/if}
			</div>
		</div>
	{/each}
</div>
