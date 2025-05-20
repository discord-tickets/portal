<script>
	import { run, preventDefault } from 'svelte/legacy';

	import { page } from '$app/stores';
	import MultiSelect from 'svelte-multiselect';
	import emoji from 'emoji-name-map';
	import Required from '$components/Required.svelte';
	import ErrorBox from '$components/ErrorBox.svelte';
	/**
	 * @typedef {Object} Props
	 * @property {import('./$types').PageData} data
	 */

	/** @type {Props} */
	let { data } = $props();

	let { categories, channels } = $state(data);
	channels = channels.filter((c) => c.type === 0); // text
	let error = $state(null);
	let loading = $state(false);
	let panel = $state({
		categories: [],
		channel: 'new',
		description: '',
		image: '',
		title: '',
		type: 'BUTTON',
		thumbnail: ''
	});

	let selectedCategories = $state([]);
	const categoryOptions = categories.reduce((acc, c) => {
		acc[(emoji.get(c.emoji) ?? '') + c.name] = c.id;
		return acc;
	}, {});

	const getChannelName = (id) => {
		return channels.find((c) => c.id === id)?.name;
	};

	const submit = async () => {
		try {
			// error = null;
			loading = true;
			const json = { ...panel };
			if (json.channel === 'new') json.channel = null;
			json.categories = selectedCategories.map((name) => categoryOptions[name]);
			const url = `/api/admin/guilds/${$page.params.guild}/panels`;
			const response = await fetch(url, {
				method: 'POST',
				body: JSON.stringify(json),
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json; charset=UTF-8'
				}
			});
			const body = await response.json();
			if (!response.ok) throw body;
			else window.location = './';
		} catch (err) {
			loading = false;
			error = err;
			window.scroll({
				top: 0,
				behavior: 'smooth'
			});
		}
	};

	run(() => {
		panel.type =
			panel.categories.length > 5
				? 'MENU'
				: panel.categories.length > 1 && panel.type === 'MESSAGE'
					? 'BUTTON'
					: panel.type;
	});
</script>

<h1 class="m-4 text-center text-4xl font-bold">Create a panel</h1>
<div class="m-2 mx-auto max-w-3xl sm:p-4">
	{#if error}
		<ErrorBox {error} />
	{/if}

	<div class="rounded-xl bg-white p-4 shadow-sm dark:bg-slate-700">
		<div class="text-center">
			{#if panel.channel !== 'new' && panel.type === 'MESSAGE'}
				<p class="p-2 text-cyan-500">
					<i class="fa-solid fa-circle-info text-2xl"></i>
					Make sure members can read and send messages in
					<span class="font-mono">#{getChannelName(panel.channel)}</span>.
				</p>
			{:else if panel.channel !== 'new' && panel.type !== 'MESSAGE'}
				<p class="p-2 text-cyan-500">
					<i class="fa-solid fa-circle-info text-2xl"></i>
					Make sure members can read but not send messages in
					<span class="font-mono">#{getChannelName(panel.channel)}</span>.
				</p>
			{/if}
		</div>
		<form onsubmit={preventDefault(() => submit())} class="my-4 text-lg">
			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				<div>
					<label>
						<span class="font-medium">Type</span>
						<i
							class="fa-solid fa-circle-question cursor-help text-gray-500 dark:text-slate-400"
							title="How will members use the panel?"
						></i>
						<select class="input form-multiselect font-normal" required bind:value={panel.type}>
							<option value="BUTTON" class="p-1" disabled={panel.categories.length > 5}>
								<!-- <i class="fa-solid fa-at text-gray-500 dark:text-slate-400" default /> -->
								Buttons
							</option>
							<option value="MENU" class="p-1">
								<!-- <i class="fa-solid fa-at text-gray-500 dark:text-slate-400" /> -->
								Select menu (dropdown)
							</option>
							<!-- <option value="MESSAGE" class="p-1" disabled={panel.categories.length > 1}>
								<i class="fa-solid fa-at text-gray-500 dark:text-slate-400" />
								Message
							</option> -->
						</select>
					</label>
				</div>
				<div>
					<label class="font-medium">
						<span class="font-medium">Channel</span>
						<i
							class="fa-solid fa-circle-question cursor-help text-gray-500 dark:text-slate-400"
							title="The channel to send the panel message to"
						></i>
						<select required class="input form-multiselect font-normal" bind:value={panel.channel}>
							<option value="new">Create a new channel</option>
							<hr />
							{#each channels as channel}
								{channel.id}
								<option value={channel.id} class="p-1">
									<!-- <i class="fa-solid fa-hashtag text-gray-500 dark:text-slate-400" /> -->
									{channel.name}
								</option>
							{/each}
						</select>
					</label>
				</div>
				<div>
					<label class="font-medium">
						<span class="font-medium">Categories</span>
						<Required />
						<i
							class="fa-solid fa-circle-question cursor-help text-gray-500 dark:text-slate-400"
							title="The category options to be available"
						></i>
						<MultiSelect
							bind:selected={selectedCategories}
							outerDivClass="text-base my-1 p-2 rounded-md border-transparent bg-gray-100 dark:bg-slate-800 font-normal shadow-sm transition-colors has-[:focus]:ring-2 has-[:focus]:ring-blurple"
							inputClass="p-0 rounded-md bg-transparent transition-colors border-0 focus:ring-0"
							ulSelectedClass="bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-slate-300"
							liSelectedClass="bg-blurple text-white text-sm font-semibold font-mono"
							ulOptionsClass="bg-white dark:bg-slate-900 p-2 max-h-48 overflow-y-auto"
							liOptionClass="rounded-md"
							liActiveOptionClass="bg-blurple text-white"
							liUserMsgClass="text-red-700 dark:text-red-500 bg-red-400/40 dark:bg-red-500/20"
							liActiveUserMsgClass=""
							maxSelectMsgClass="text-xs"
							noMatchingOptionsMsg="Create a category in the categories section"
							required={true}
							maxSelect={panel.type === 'MENU' ? 25 : 5}
							options={Object.keys(categoryOptions)}
						/>
					</label>
				</div>
				<div>
					<label>
						<span class="font-medium">Title</span>
						<i
							class="fa-solid fa-circle-question cursor-help text-gray-500 dark:text-slate-400"
							title="The embed title"
						></i>
						<input type="text" class="input form-input" required bind:value={panel.title} />
					</label>
				</div>
				<div>
					<label>
						<span class="font-medium">Large image</span>
						<i
							class="fa-solid fa-circle-question cursor-help text-gray-500 dark:text-slate-400"
							title="Optional - the embed image"
						></i>
						<input type="url" class="input form-input" bind:value={panel.image} />
					</label>
				</div>
				<div>
					<label>
						<span class="font-medium">Small image (thumbnail)</span>
						<i
							class="fa-solid fa-circle-question cursor-help text-gray-500 dark:text-slate-400"
							title="Optional - the embed thumbnail"
						></i>
						<input type="url" class="input form-input" bind:value={panel.thumbnail} />
					</label>
				</div>
				<div>
					<label class="font-medium">
						<span class="font-medium">Description</span>
						<i
							class="fa-solid fa-circle-question cursor-help text-gray-500 dark:text-slate-400"
							title="Optional - the embed description"
						></i>
						<textarea class="input form-input h-24" maxlength="4096" bind:value={panel.description}
						></textarea>
					</label>
				</div>
				<div class="place-self-center">
					<button
						type="submit"
						disabled={loading}
						class="mt-4 rounded-lg bg-green-300 p-2 px-5 font-medium transition duration-300 hover:bg-green-500 hover:text-white disabled:cursor-not-allowed dark:bg-green-500/50 dark:hover:bg-green-500 dark:hover:text-white"
					>
						{#if loading}
							<i class="fa-solid fa-spinner animate-spin"></i>
						{/if}
						Create
					</button>
				</div>
			</div>
		</form>
	</div>
	<div class="mx-auto mt-8 max-w-lg text-center text-base">
		<div class="rounded-xl border-2 border-cyan-500 bg-cyan-500/20 p-2">
			<i class="fa-solid fa-circle-info text-2xl text-cyan-500"></i>
			<br />
			Looking to edit or remove a panel? Just delete the message or channel in Discord.
		</div>
	</div>
</div>
