<script context="module">
	const host = import.meta.env.PROD ? '' : import.meta.env.VITE_HOST;
	/** @type {import('./__types/[slug]').Load} */
	export async function load({ params, fetch, session, stuff }) {
		const url = `${host}/api/admin/guilds/${params.guild}/categories`;
		const fetchOptions = {
			credentials: 'include',
			headers: {
				'Content-type': 'application/json; charset=UTF-8'
			}
		};
		let body;
		if (params.category === 'new') {
			body = {
				channelName: null,
				claiming: false,
				description: null,
				discordCategory: '',
				enableFeedback: false,
				image: null,
				memberLimit: 1,
				name: null,
				openingMessage: null,
				pingRoles: [],
				questions: [],
				ratelimit: null,
				requiredRoles: [],
				requireTopic: false,
				staffRoles: [],
				totalLimit: 50
			};
		} else {
			const response = await fetch(`${url}/${params.category}`, fetchOptions);
			body = response.status < 500 ? await response.json() : null;
		}
		return {
			// status: response.status,
			// error: !response.ok ? body?.message || String(response.status) : null,
			props: {
				url: params.category === 'new' ? url : `${url}/${params.category}`,
				category: body,
				channels: await (
					await fetch(
						`${host}/api/admin/guilds/${params.guild}/data?query=channels.cache`,
						fetchOptions
					)
				).json(),
				roles: await (
					await fetch(
						`${host}/api/admin/guilds/${params.guild}/data?query=roles.cache`,
						fetchOptions
					)
				).json()
			}
		};
	}
</script>

<script>
	export let url;
	export let category;
	export let channels;
	export let roles;
	import ms from 'ms';

	const slowmodes = [
		'5s',
		'10s',
		'15s',
		'30s',
		'1m',
		'2m',
		'5m',
		'10m',
		'15m',
		'30m',
		'1h',
		'2h',
		'6h'
	];

	channels = channels.filter((c) => c.type === 'GUILD_CATEGORY');
	roles = roles.filter((r) => r.name !== '@everyone');
	console.log(category);
	let error = null;
	let loading = false;
	const submit = async () => {
		try {
			error = null;
			loading = true;
			const json = { ...category };

			console.log(json);

			const response = await fetch(url, {
				method: category.id ? 'PATCH' : 'POST',
				body: JSON.stringify(json),
				credentials: 'include',
				headers: {
					'Content-type': 'application/json; charset=UTF-8'
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

	const del = async () => {
		try {
			const confirmed = confirm('Are you sure?\nThis will delete all associated tickets (including archives).');
			if (!confirmed) return false;
			error = null;
			loading = true;

			const response = await fetch(url, {
				method: 'DELETE',
				credentials: 'include',
				headers: {
					'Content-type': 'application/json; charset=UTF-8'
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
</script>

<div class="mb-8 text-orange-600 dark:text-orange-400 text-center">
	<p>
		<i class="fa-solid fa-triangle-exclamation" />
		<a href="https://discordtickets.app/settings/categories" class="font-semibold hover:underline"
			>Read the documentation</a
		>
		to avoid problems.
	</p>
</div>
<h1 class="m-4 text-4xl font-bold text-center">Categories</h1>
<h2 class="m-4 text-2xl font-semibold text-center text-gray-500 dark:text-slate-400">
	{category.name || 'New category'}
</h2>
<div class="m-2 p-4 max-w-5xl mx-auto text-lg">
	{#if error}
		<div id="error" class="text-center">
			<div
				class="bg-red-400 dark:bg-red-500 text-red-800 dark:text-red-400 bg-opacity-40 dark:bg-opacity-20 mb-4 p-6 px-12 rounded-lg text-center max-w-lg inline-block"
			>
				<p class="font-semibold text-xl">Error</p>
				{error.message ?? error}
			</div>
		</div>
	{/if}
	<form on:submit|preventDefault={() => submit()} class="my-4">
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
			<div class="grid grid-cols-1 gap-6">
				<div>
					<label class="font-medium">
						Name
						<i
							class="fa-solid fa-circle-question text-gray-500 dark:text-slate-400 cursor-help"
							title="The name of the category"
						/>
						<input type="text" class="form-input input" required bind:value={category.name} />
					</label>
				</div>
				<div>
					<label class="font-medium">
						Channel name
						<i
							class="fa-solid fa-circle-question text-gray-500 dark:text-slate-400 cursor-help"
							title="The name of ticket channels"
						/>
						<input
							type="text"
							class="form-input input"
							placeholder="ticket-{'{'}num{'}'}"
							bind:value={category.channelName}
						/>
					</label>
				</div>
				<div>
					<label for="claiming" class="font-medium">
						Claiming
						<i
							class="fa-solid fa-circle-question text-gray-500 dark:text-slate-400 cursor-help"
							title="Allow staff to claim tickets?"
						/>
						<input
							type="checkbox"
							id="claiming"
							name="claiming"
							class="form-checkbox"
							bind:checked={category.claiming}
						/>
					</label>
				</div>
				<div>
					<label class="font-medium">
						Description
						<i
							class="fa-solid fa-circle-question text-gray-500 dark:text-slate-400 cursor-help"
							title="What is this category for?"
						/>
						<input
							type="text"
							class="form-input input"
							required
							bind:value={category.description}
						/>
					</label>
				</div>
				<div>
					<label class="font-medium">
						Discord category
						<i
							class="fa-solid fa-circle-question text-gray-500 dark:text-slate-400 cursor-help"
							title="Which category channel should ticket channels be created under?"
						/>
						<select class="form-multiselect input" bind:value={category.discordCategory}>
							<option value="">Create a new category</option>
							<option disabled>------------</option>
							{#each channels as channel}
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
						Emoji
						<i
							class="fa-solid fa-circle-question text-gray-500 dark:text-slate-400 cursor-help"
							title="Emoji used for buttons & dropdowns"
						/>
						<input type="text" class="form-input input" required bind:value={category.emoji} />
					</label>
				</div>
				<div>
					<label for="enableFeedback" class="font-medium">
						Feedback
						<i
							class="fa-solid fa-circle-question text-gray-500 dark:text-slate-400 cursor-help"
							title="Gather feedback from users?"
						/>
						<input
							type="checkbox"
							id="enableFeedback"
							name="enableFeedback"
							class="form-checkbox"
							bind:checked={category.enableFeedback}
						/>
					</label>
				</div>
				<div>
					<label class="font-medium">
						Image
						<i
							class="fa-solid fa-circle-question text-gray-500 dark:text-slate-400 cursor-help"
							title="A link to an image to be sent with the opening message."
						/>
						<input type="url" class="form-input input" bind:value={category.image} />
					</label>
				</div>
				<div>
					<label class="font-medium">
						Member limit
						<i
							class="fa-solid fa-circle-question text-gray-500 dark:text-slate-400 cursor-help"
							title="How many tickets in this category can each member have open?"
						/>
						<input
							type="number"
							min="1"
							max="10"
							class="form-input input"
							bind:value={category.memberLimit}
						/>
					</label>
				</div>
				<div>
					<label class="font-medium">
						Opening message
						<i
							class="fa-solid fa-circle-question text-gray-500 dark:text-slate-400 cursor-help"
							title="Content to be sent in the opening message of each ticket."
						/>
						<textarea
							class="form-input input"
							required
							maxlength="1000"
							bind:value={category.openingMessage}
						/>
					</label>
				</div>
				<div>
					<label class="font-medium">
						Ping roles
						<i
							class="fa-solid fa-circle-question text-gray-500 dark:text-slate-400 cursor-help"
							title="Roles that should be pinged upon ticket creation."
						/>
						<select
							multiple
							class="form-multiselect input font-normal"
							bind:value={category.pingRoles}
						>
							{#each roles as role}
								<option value={role.id} class="p-1">
									<i class="fa-solid fa-at text-gray-500 dark:text-slate-400" />
									{role.name}
								</option>
							{/each}
						</select>
					</label>
				</div>
				<div>
					<label class="font-medium">
						Slow mode
						<i
							class="fa-solid fa-circle-question text-gray-500 dark:text-slate-400 cursor-help"
							title="Should slow mode be enabled?"
						/>
						<select class="form-multiselect input font-normal" bind:value={category.ratelimit}>
							<option value={null} class="p-1">
								<i class="fa-solid fa-at text-gray-500 dark:text-slate-400" />
								Off
							</option>
							{#each slowmodes as slowmode}
								<option value={ms(slowmode) / 1000} class="p-1">
									<i class="fa-solid fa-at text-gray-500 dark:text-slate-400" />
									{slowmode}
								</option>
							{/each}
						</select>
					</label>
				</div>
				<div>
					<label class="font-medium">
						Required roles
						<i
							class="fa-solid fa-circle-question text-gray-500 dark:text-slate-400 cursor-help"
							title="Roles that a user needs to create a ticket."
						/>
						<select
							multiple
							class="form-multiselect input font-normal"
							bind:value={category.requiredRoles}
						>
							{#each roles as role}
								<option value={role.id} class="p-1">
									<i class="fa-solid fa-at text-gray-500 dark:text-slate-400" />
									{role.name}
								</option>
							{/each}
						</select>
					</label>
				</div>
				<div>
					<label for="requireTopic" class="font-medium">
						Require topic
						<i
							class="fa-solid fa-circle-question text-gray-500 dark:text-slate-400 cursor-help"
							title="Require a topic before ticket creation?"
						/>
						<input
							type="checkbox"
							id="requireTopic"
							name="requireTopic"
							class="form-checkbox"
							bind:checked={category.requireTopic}
						/>
					</label>
				</div>
				<div>
					<label class="font-medium">
						Staff roles
						<i
							class="fa-solid fa-circle-question text-gray-500 dark:text-slate-400 cursor-help"
							title="Roles that will be able to view tickets."
						/>
						<select
							multiple
							required
							class="form-multiselect input font-normal"
							bind:value={category.staffRoles}
						>
							{#each roles as role}
								<option value={role.id} class="p-1">
									<i class="fa-solid fa-at text-gray-500 dark:text-slate-400" />
									{role.name}
								</option>
							{/each}
						</select>
					</label>
				</div>
				<div>
					<label class="font-medium">
						Total limit
						<i
							class="fa-solid fa-circle-question text-gray-500 dark:text-slate-400 cursor-help"
							title="The total number of tickets that can be open at once."
						/>
						<input
							type="number"
							min="1"
							max="50"
							class="form-input input"
							bind:value={category.totalLimit}
						/>
					</label>
				</div>
			</div>
			<div>
				<div class="bg-white dark:bg-slate-700 p-4 rounded-xl shadow-sm">
					<h3 class="font-bold text-xl">Questions</h3>
				</div>
				<div class="flex justify-end gap-4">
					{#if category.id}
						<button
							type="button"
							disabled={loading}
							class="mt-4 bg-red-300 hover:bg-red-500 hover:text-white dark:bg-red-500/20 dark:hover:bg-red-500 dark:hover:text-white p-2 px-5 rounded-lg font-medium transition duration-300 disabled:cursor-not-allowed"
							on:click={del}
						>
							{#if loading}
								<i class="fa-solid fa-spinner animate-spin" />
							{:else}
								<i class="fa-solid fa-trash" />
							{/if}
							Delete
						</button>
					{/if}
					<button
						type="submit"
						disabled={loading}
						class="mt-4 bg-green-300 hover:bg-green-500 hover:text-white dark:bg-green-500/20 dark:hover:bg-green-500 dark:hover:text-white p-2 px-5 rounded-lg font-medium transition duration-300 disabled:cursor-not-allowed"
					>
						{#if loading}
							<i class="fa-solid fa-spinner animate-spin" />
						{/if}
						Submit
					</button>
				</div>
			</div>
		</div>
	</form>
</div>
