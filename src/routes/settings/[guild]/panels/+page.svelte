<script>
	/** @type {import('./$types').PageData} */
	export let data;

	import { page } from '$app/stores';
	import emoji from 'emoji-name-map';
	import Required from '$components/Required.svelte';

	let { categories, channels } = data;
	channels = channels.filter((c) => c.type === 0); // text
	let error = null;
	let loading = false;
	let panel = {
		categories: [],
		channel: 'new',
		description: '',
		image: '',
		title: '',
		type: 'BUTTON',
		thumbnail: ''
	};

	const getChannelName = (id) => {
		return channels.find((c) => c.id === id)?.name;
	};

	const submit = async () => {
		try {
			// error = null;
			loading = true;
			const json = { ...panel };
			if (json.channel === 'new') json.channel = null;
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

	$: panel.type =
		panel.categories.length > 5
			? 'MENU'
			: panel.categories.length > 1 && panel.type === 'MESSAGE'
			? 'BUTTON'
			: panel.type;
</script>

<h1 class="m-4 text-4xl font-bold text-center">Create a panel</h1>
<div class="m-2 sm:p-4 max-w-3xl mx-auto">
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
	<div class="bg-white dark:bg-slate-700 p-4 rounded-xl shadow-sm">
		<div class="text-center">
			{#if panel.channel !== 'new' && panel.type === 'MESSAGE'}
				<p class="text-cyan-500 p-2">
					<i class="fa-solid fa-circle-info text-2xl" />
					Make sure members can read and send messages in
					<span class="font-mono">#{getChannelName(panel.channel)}</span>.
				</p>
			{:else if panel.channel !== 'new' && panel.type !== 'MESSAGE'}
				<p class="text-cyan-500 p-2">
					<i class="fa-solid fa-circle-info text-2xl" />
					Make sure members can read but not send messages in
					<span class="font-mono">#{getChannelName(panel.channel)}</span>.
				</p>
			{/if}
		</div>
		<form on:submit|preventDefault={() => submit()} class="text-lg my-4">
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<label>
						<span class="font-medium">Type</span>
						<i
							class="fa-solid fa-circle-question text-gray-500 dark:text-slate-400 cursor-help"
							title="How will members use the panel?"
						/>
						<select class="form-multiselect input font-normal" required bind:value={panel.type}>
							<option value="BUTTON" class="p-1" disabled={panel.categories.length > 5}>
								<i class="fa-solid fa-at text-gray-500 dark:text-slate-400" default />
								Buttons
							</option>
							<option value="MENU" class="p-1">
								<i class="fa-solid fa-at text-gray-500 dark:text-slate-400" />
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
							class="fa-solid fa-circle-question text-gray-500 dark:text-slate-400 cursor-help"
							title="The channel to send the panel message to"
						/>
						<select required class="form-multiselect input font-normal" bind:value={panel.channel}>
							<option value="new">Create a new channel</option>
							<option disabled>------------</option>
							{#each channels as channel}
								{channel.id}
								<option value={channel.id} class="p-1">
									<i class="fa-solid fa-hashtag text-gray-500 dark:text-slate-400" />
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
							class="fa-solid fa-circle-question text-gray-500 dark:text-slate-400 cursor-help"
							title="The category options to be available"
						/>
						<select
							multiple
							required
							class="form-multiselect input font-normal h-24"
							bind:value={panel.categories}
						>
							{#each categories as category}
								<option value={category.id} class="p-1 m-1 rounded">
									{emoji.get(category.emoji) ?? ''}
									{category.name}
								</option>
							{/each}
						</select>
					</label>
				</div>
				<div>
					<label class="font-medium">
						<span class="font-medium">Description</span>
						<i
							class="fa-solid fa-circle-question text-gray-500 dark:text-slate-400 cursor-help"
							title="Optional - the embed description"
						/>
						<textarea
							class="form-input input h-24"
							maxlength="4096"
							bind:value={panel.description}
						/>
					</label>
				</div>
				<div>
					<label>
						<span class="font-medium">Title</span>
						<Required />
						<i
							class="fa-solid fa-circle-question text-gray-500 dark:text-slate-400 cursor-help"
							title="The embed title"
							required
						/>
						<input type="text" class="form-input input" required bind:value={panel.title} />
					</label>
				</div>
				<div>
					<label>
						<span class="font-medium">Large image</span>
						<i
							class="fa-solid fa-circle-question text-gray-500 dark:text-slate-400 cursor-help"
							title="Optional - the embed image"
						/>
						<input type="url" class="form-input input" bind:value={panel.image} />
					</label>
				</div>
				<div>
					<label>
						<span class="font-medium">Small image (thumbnail)</span>
						<i
							class="fa-solid fa-circle-question text-gray-500 dark:text-slate-400 cursor-help"
							title="Optional - the embed thumbnail"
						/>
						<input type="url" class="form-input input" bind:value={panel.thumbnail} />
					</label>
				</div>
				<div class="place-self-center">
					<button
						type="submit"
						disabled={loading}
						class="mt-4 bg-green-300 hover:bg-green-500 hover:text-white dark:bg-green-500/50 dark:hover:bg-green-500 dark:hover:text-white p-2 px-5 rounded-lg font-medium transition duration-300 disabled:cursor-not-allowed"
					>
						{#if loading}
							<i class="fa-solid fa-spinner animate-spin" />
						{/if}
						Create
					</button>
				</div>
			</div>
		</form>
	</div>
	<div class="mt-8 text-center text-base max-w-lg mx-auto">
		<div class="p-2 rounded-xl border-cyan-500 bg-cyan-500/20 border-2">
			<i class="fa-solid fa-circle-info text-2xl text-cyan-500" />
			<br />
			Looking to edit or remove a panel? Just delete the message or channel in Discord.
		</div>
	</div>
</div>
