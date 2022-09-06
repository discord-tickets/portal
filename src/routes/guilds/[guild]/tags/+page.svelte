<script>
	/** @type {import('./$types').PageData} */
	export let data;

	import TagInputs from '../../../../components/TagInputs.svelte';

	let { url, tags } = data;
	let shown = tags;
	let loading = false;
	let error = null;
	let tag = {
		content: null,
		name: null,
		regex: null
	};
	let expanded = null;

	const create = async () => {
		try {
			error = null;
			loading = true;
			const json = { ...tag };

			const response = await fetch(url, {
				method: 'POST',
				body: JSON.stringify(json),
				credentials: 'include',
				headers: {
					'Content-type': 'application/json; charset=UTF-8'
				}
			});
			const body = await response.json();

			if (!response.ok) throw body;
			else window.location = './tags';
		} catch (err) {
			loading = false;
			error = err;
			window.scroll({
				top: 0,
				behavior: 'smooth'
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
					'Content-type': 'application/json; charset=UTF-8'
				}
			});
			const body = await response.json();

			if (!response.ok) throw body;
			else window.location = './tags';
		} catch (err) {
			loading = false;
			error = err;
			window.scroll({
				top: 0,
				behavior: 'smooth'
			});
		}
	};

	const del = async (id) => {
		try {
			error = null;
			loading = true;

			const response = await fetch(`${url}/${id}`, {
				method: 'DELETE',
				credentials: 'include',
				headers: {
					'Content-type': 'application/json; charset=UTF-8'
				}
			});
			const body = await response.json();

			if (!response.ok) throw body;
			else window.location = './tags';
		} catch (err) {
			loading = false;
			error = err;
			window.scroll({
				top: 0,
				behavior: 'smooth'
			});
		}
	};

	const filter = (value) => {
		shown = tags.filter((t) => {
			const regex = new RegExp(value.replace(/(?=\W)/g, '\\'), 'i');
			return regex.test(t.name) || regex.test(t.regex) || regex.test(t.content);
		});
	};
</script>

<div class="mb-8 text-orange-600 dark:text-orange-400 text-center">
	<p>
		<i class="fa-solid fa-triangle-exclamation" />
		<a href="https://discordtickets.app/settings/tags" class="font-semibold hover:underline"
			>Read the documentation</a
		>
		to avoid problems.
	</p>
</div>
<h1 class="m-4 text-4xl font-bold text-center">Tags</h1>
{#if error}
	<div id="error" class="text-center break-words">
		<div
			class="bg-red-400 dark:bg-red-500 text-red-800 dark:text-red-400 bg-opacity-40 dark:bg-opacity-20 mb-4 p-6 px-12 rounded-lg text-center max-w-lg inline-block"
		>
			<p class="font-semibold text-xl">Error</p>
			{error.message ?? error}
		</div>
	</div>
{/if}
<div class="m-2 md:mt-8 flex flex-col-reverse lg:flex-row gap-12 max-w-5xl mx-auto">
	<div class="w-full">
		<div class="grid grid-cols-1 gap-4">
			<div>
				<input
					type="text"
					class="form-input input"
					placeholder="Search"
					on:input={(event) => filter(event.target.value)}
				/>
			</div>
			{#each shown as tag}
				<div class="bg-white dark:bg-slate-700 p-4 rounded-xl shadow-sm">
					<span class="font-semibold text-lg">{tag.name}</span>
					<p
						class="select-none text-gray-500 dark:text-slate-400 hover:text-blurple dark:hover:text-blurple cursor-pointer transition duration-300"
						on:click={() => (expanded = expanded === tag.id ? null : tag.id)}
					>
						<i
							class="fa-solid {expanded === tag.id
								? 'fa-angle-up'
								: 'fa-angle-down'} float-right text-xl"
						/>
						<span class="text-sm"> Click to {expanded === tag.id ? 'collapse' : 'expand'}</span>
					</p>
					{#if expanded === tag.id}
						<div class="m-2">
							<form on:submit|preventDefault={() => save(tag)} id={tag.id} name={tag.name}>
								<TagInputs bind:state={tag} />
							</form>
							<div class="mt-4 flex flex-grow gap-4">
								<button
									type="button"
									disabled={loading}
									class="flex-1 bg-red-300 hover:bg-red-500 hover:text-white dark:bg-red-500/75 dark:hover:bg-red-500 dark:hover:text-white p-2 px-5 rounded-lg font-medium transition duration-300 disabled:cursor-not-allowed"
									on:click={() => del(tag.id)}
								>
									{#if loading}
										<i class="fa-solid fa-spinner animate-spin" />
									{:else}
										<i class="fa-solid fa-trash" />
									{/if}
									Delete
								</button>
								<button
									type="submit"
									for={tag.id}
									form={tag.id}
									disabled={loading}
									class="flex-1 bg-green-300 hover:bg-green-500 hover:text-white dark:bg-green-500/75 dark:hover:bg-green-500 dark:hover:text-white p-2 px-5 rounded-lg font-medium transition duration-300 disabled:cursor-not-allowed"
								>
									{#if loading}
										<i class="fa-solid fa-spinner animate-spin" />
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
		<div class="bg-white dark:bg-slate-700 p-4 rounded-xl shadow-sm">
			<h3 class="text-center font-bold text-xl">Create a tag</h3>
			<form on:submit|preventDefault={() => create()} class="text-lg my-4">
				<div class="grid grid-cols-1 gap-2">
					<TagInputs bind:state={tag} />
					<button
						type="submit"
						disabled={loading}
						class="mt-4 bg-green-300 hover:bg-green-500 hover:text-white dark:bg-green-500/75 dark:hover:bg-green-500 dark:hover:text-white p-2 px-5 rounded-lg font-medium transition duration-300 disabled:cursor-not-allowed"
					>
						{#if loading}
							<i class="fa-solid fa-spinner animate-spin" />
						{/if}
						Create
					</button>
				</div>
			</form>
		</div>
	</div>
</div>
