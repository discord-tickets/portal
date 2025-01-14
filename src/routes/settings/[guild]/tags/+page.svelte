<!-- @migration-task Error while migrating Svelte code: Cannot reassign or bind to each block argument in runes mode. Use the array and index variables instead (e.g. `array[i] = value` instead of `entry = value`) -->
<script>
	import { preventDefault } from 'svelte/legacy';

	import { page } from '$app/stores';
	import ErrorBox from '$components/ErrorBox.svelte';
	import TagInputs from '$components/TagInputs.svelte';
	import { toasts, ToastContainer, BootstrapToast } from 'svelte-toasts';
	import { tagsState as tS } from '$components/state.svelte';
	/** @type {{data: import('./$types').PageData}} */
	let { data } = $props();

	const url = `/api/admin/guilds/${$page.params.guild}/tags`;
	let { tags } = data;
	tS.tags = tags;
	let shown = $state(tS.tags);
	let loading = $state(false);
	let error = $state(null);
	let touch = $state({
		content: null,
		name: null,
		regex: null
	});
	let expanded = $state(null);
	let search = $state('');

	const filter = (value) => {
		shown = tS.tags.filter((t) => {
			const regex = new RegExp(value.replace(/(?=\W)/g, '\\'), 'i');
			return regex.test(t.name) || regex.test(t.regex) || regex.test(t.content);
		});
	};

	const create = async () => {
		try {
			error = null;
			loading = true;
			const json = { ...touch };

			const response = await fetch(url, {
				method: 'POST',
				body: JSON.stringify(json),
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json; charset=UTF-8'
				}
			});
			const body = await response.json();

			if (!response.ok) {
				throw body;
			} else {
				tS.tags.push(body);
				filter(search);
				touch = {
					content: null,
					name: null,
					regex: null
				};
				loading = false;
				toasts.add({
					description: 'Tag created',
					type: 'success'
				});
			}
		} catch (err) {
			loading = false;
			error = err;
			window.scroll({
				top: 0,
				behavior: 'smooth'
			});
			toasts.add({
				description: 'Tag creation failed',
				type: 'error'
			});
		}
	};

	const save = async (tag) => {
		try {
			error = null;
			loading = true;
			const json = { ...tag };

			const response = await fetch(`${url}/${json.id}`, {
				method: 'PATCH',
				body: JSON.stringify(json),
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json; charset=UTF-8'
				}
			});
			const body = await response.json();

			if (!response.ok) {
				throw body;
			} else {
				loading = false;
				toasts.add({
					description: 'Tag saved',
					type: 'success'
				});
			}
		} catch (err) {
			loading = false;
			error = err;
			window.scroll({
				top: 0,
				behavior: 'smooth'
			});
			toasts.add({
				description: 'Tag saving failed',
				type: 'error'
			});
		}
	};

	const del = async (id) => {
		try {
			error = null;
			loading = true;

			const response = await fetch(`${url}/${id}`, { method: 'DELETE' });
			const body = await response.json();
			console.log(body);
			if (!response.ok) {
				throw body;
			} else {
				const index = tS.tags.findIndex((t) => t.id === id);
				tS.tags.splice(index, 1);
				filter(search);
				loading = false;
				toasts.add({
					description: 'Tag deleted',
					type: 'success'
				});
			}
		} catch (err) {
			loading = false;
			error = err;
			window.scroll({
				top: 0,
				behavior: 'smooth'
			});
			toasts.add({
				description: 'Tag deletion failed',
				type: 'error'
			});
		}
	};
</script>

<div class="mb-8 text-center text-orange-600 dark:text-orange-400">
	<p>
		<i class="fa-solid fa-triangle-exclamation"></i>
		<a href="https://discordtickets.app/configuration/tags" class="font-semibold hover:underline"
			>Read the documentation</a
		>
		to avoid problems.
	</p>
</div>
<h1 class="m-4 text-center text-4xl font-bold">Tags</h1>
{#if error}
	<ErrorBox {error} />
{/if}
<div class="m-2 mx-auto flex max-w-5xl flex-col-reverse gap-12 md:mt-8 lg:flex-row">
	<div class="w-full">
		<div class="grid grid-cols-1 gap-4">
			<div>
				<input
					type="text"
					class="input form-input"
					placeholder="Search"
					bind:value={search}
					oninput={(event) => filter(event.target.value)}
				/>
			</div>
			{#each shown as tag, i}
				<div class="rounded-xl bg-white p-4 shadow-sm dark:bg-slate-700">
					<span class="text-lg font-semibold">{tag.name}</span>
					<p
						class="cursor-pointer select-none text-gray-500 transition duration-300 hover:text-blurple dark:text-slate-400 dark:hover:text-blurple"
						onclick={() => (expanded = expanded === tag.id ? null : tag.id)}
					>
						<i
							class="fa-solid {expanded === tag.id
								? 'fa-angle-up'
								: 'fa-angle-down'} float-right text-xl"
						></i>
						<span class="text-sm"> Click to {expanded === tag.id ? 'collapse' : 'expand'}</span>
					</p>
					{#if expanded === tag.id}
						<div class="m-2">
							<form onsubmit={preventDefault(() => save(tag))} id={tag.id} name={tag.name}>
								<TagInputs bind:tag={tS.tags[i]} />
							</form>
							<div class="mt-4 flex flex-grow gap-4">
								<button
									type="button"
									disabled={loading}
									class="flex-1 rounded-lg bg-red-300 p-2 px-5 font-medium transition duration-300 hover:bg-red-500 hover:text-white disabled:cursor-not-allowed dark:bg-red-500/75 dark:hover:bg-red-500 dark:hover:text-white"
									onclick={() => del(tag.id)}
								>
									{#if loading}
										<i class="fa-solid fa-spinner animate-spin"></i>
									{:else}
										<i class="fa-solid fa-trash"></i>
									{/if}
									Delete
								</button>
								<button
									type="submit"
									for={tag.id}
									form={tag.id}
									disabled={loading}
									class="flex-1 rounded-lg bg-green-300 p-2 px-5 font-medium transition duration-300 hover:bg-green-500 hover:text-white disabled:cursor-not-allowed dark:bg-green-500/75 dark:hover:bg-green-500 dark:hover:text-white"
								>
									{#if loading}
										<i class="fa-solid fa-spinner animate-spin"></i>
									{/if}
									Save
								</button>
							</div>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	</div>
	<div class="w-full">
		<div class="rounded-xl bg-white p-4 shadow-sm dark:bg-slate-700">
			<h3 class="text-center text-xl font-bold">Create a tag</h3>
			<form onsubmit={preventDefault(() => create())} class="my-4 text-lg">
				<div class="grid grid-cols-1 gap-2">
					<TagInputs bind:tag={touch} />
					<button
						type="submit"
						disabled={loading}
						class="mt-4 rounded-lg bg-green-300 p-2 px-5 font-medium transition duration-300 hover:bg-green-500 hover:text-white disabled:cursor-not-allowed dark:bg-green-500/75 dark:hover:bg-green-500 dark:hover:text-white"
					>
						{#if loading}
							<i class="fa-solid fa-spinner animate-spin"></i>
						{/if}
						Create
					</button>
				</div>
			</form>
		</div>
	</div>
</div>

<ToastContainer duration={3000} theme={data.theme}>
	{#snippet children({ data: toasted })}
		<BootstrapToast data={toasted} />
	{/snippet}
</ToastContainer>
