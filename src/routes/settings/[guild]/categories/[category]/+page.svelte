<script>
	/** @type {import('./$types').PageData} */
	export let data;

	import ms from 'ms';
	import emoji from 'emoji-name-map';
	import { marked } from 'marked';
	import { v4 as uuidv4 } from 'uuid';
	import CategoryQuestions from '$components/CategoryQuestions/Questions.svelte';
	import Required from '$components/Required.svelte';
	import { getContext, onMount } from 'svelte';
	import { beforeNavigate } from '$app/navigation';

	let modified = false;

	beforeNavigate((navigation) => {
		if (modified && !confirm('You have unsaved changes; are you sure you want to leave?')) {
			navigation.cancel();
		}
	});

	onMount(async () => {
		const { applyPolyfills, defineCustomElements } = await import(
			'@skyra/discord-components-core/loader'
		);
		applyPolyfills().then(() => {
			defineCustomElements();
		});

		window.addEventListener('beforeunload', (event) => {
			if (modified) {
				event.preventDefault();
				event.returnValue = '';
			}
		});
	});

	let { category, channels, roles, url } = data;

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

	channels = channels.filter((c) => c.type === 4); // category
	roles = roles.filter((r) => r.name !== '@everyone').sort((a, b) => b.rawPosition - a.rawPosition);
	roles.forEach((r) => {
		r._hexColor = r.color > 0 ? `#${r.color.toString(16).padStart(6, '0')}` : null;
		r._style = r._hexColor ? `color: ${r._hexColor}` : '';
	});

	category.cooldown = category.cooldown ? ms(category.cooldown) : '';

	let error = null;
	let loadingSubmit = false;
	let loadingDelete = false;

	const submit = async () => {
		try {
			// error = null;
			loadingSubmit = true;
			const json = { ...category };

			if (category.discordCategory === 'new') json.discordCategory = null;
			json.cooldown = category.cooldown ? ms(category.cooldown) : null;

			json.questions.forEach((q) => {
				if (q.type === 'TEXT') {
					if (q.value.length < q.minLength)
						throw `The value of the "${q.label}" question is shorter than the minimum length.`;
					if (q.value.length > q.maxLength)
						throw `The value of the "${q.label}" question is longer than the maximum length.`;
				}
			});

			const response = await fetch(url, {
				method: category.id ? 'PATCH' : 'POST',
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
				modified = false;
				window.location = './';
			}
		} catch (err) {
			loadingSubmit = false;
			error = err;
			window.scroll({
				top: 0,
				behavior: 'smooth'
			});
		}
	};

	const del = async () => {
		try {
			const confirmed = confirm(
				'Are you sure?\nThis will delete all associated tickets (including messages, feedback, etc).'
			);
			if (!confirmed) return false;
			// error = null;
			loadingDelete = true;

			const response = await fetch(url, {
				method: 'DELETE',
				credentials: 'include',
			});
			const body = await response.json();

			if (!response.ok) throw body;
			else window.location = './';
		} catch (err) {
			loadingDelete = false;
			error = err;
			window.scroll({
				top: 0,
				behavior: 'smooth'
			});
		}
	};

	const getRole = (id) => roles.find((r) => r.id === id);

	$: category.customTopic = category.questions.find((q) => q.id === category.customTopic)
		? category.customTopic
		: null;
	$: category.requireTopic = category.questions.length > 0 ? false : category.requireTopic;
</script>

<div class="mb-8 text-orange-600 dark:text-orange-400 text-center">
	<p>
		<i class="fa-solid fa-triangle-exclamation" />
		<a
			href="https://discordtickets.app/configuration/categories"
			class="font-semibold hover:underline">Read the documentation</a
		>
		to avoid problems.
	</p>
</div>
<h1 class="m-4 text-4xl font-bold text-center">Categories</h1>
<h2 class="m-4 text-2xl font-semibold text-center text-gray-500 dark:text-slate-400">
	{emoji.get(category.emoji) ?? ''}
	{category.name || 'New category'}
</h2>
<div class="m-2 p-4 max-w-5xl mx-auto text-lg">
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
	<form on:submit|preventDefault={() => submit()} on:change={() => (modified = true)} class="my-4">
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
			<div class="grid grid-cols-1 gap-8">
				<div>
					<label class="font-medium">
						Name
						<Required />
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
						{#if category.id}
							<Required />
						{/if}
						<i
							class="fa-solid fa-circle-question text-gray-500 dark:text-slate-400 cursor-help"
							title="The name of ticket channels"
						/>
						<input
							type="text"
							class="form-input input"
							placeholder="ticket-{'{'}num{'}'}"
							required={!!category.id}
							bind:value={category.channelName}
						/>
					</label>
					{#if category.channelName}
						<p class="text-sm font-semibold mt-2 mb-1">Preview</p>
						<div
							class="block p-3 w-full rounded-md shadow-sm bg-blurple/20 dark:bg-blurple/20 text-sm font-mono break-words"
						>
							<i class="fa-solid fa-hashtag text-gray-500 dark:text-slate-400" />
							<span class="marked">
								{@html marked
									.parse(category.channelName.replace(/\n/g, '\n\n'))
									.replace(/{+\s?num(ber)?\s?}+/gi, 1)
									.replace(/{+\s?(nick|display)(name)?\s?}+/gi, getContext('user').username)
									.replace(/{+\s?(user)?name\s?}+/gi, getContext('user').username)}
							</span>
						</div>
					{/if}
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
						Cooldown
						<i
							class="fa-solid fa-circle-question text-gray-500 dark:text-slate-400 cursor-help"
							title="How long should members have to wait before creating another ticket?"
						/>
						<input type="text" class="form-input input" bind:value={category.cooldown} />
					</label>
				</div>
				<div>
					<label class="font-medium">
						Description
						<Required />
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
						<Required />
						<i
							class="fa-solid fa-circle-question text-gray-500 dark:text-slate-400 cursor-help"
							title="Which category channel should ticket channels be created under?"
						/>
						<select class="form-multiselect input" required bind:value={category.discordCategory}>
							{#if !category.discordCategory || category.discordCategory === 'new'}
								<option value="new">Create a new category</option>
								<option disabled>------------</option>
							{/if}
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
						<Required />
						<i
							class="fa-solid fa-circle-question text-gray-500 dark:text-slate-400 cursor-help"
							title="Emoji used for buttons & dropdowns"
						/>
						<span class="text-2xl">{emoji.get(category.emoji) ?? ''}</span>
						<input type="text" class="form-input input" required bind:value={category.emoji} />
					</label>
				</div>
				<div>
					<label for="enableFeedback" class="font-medium">
						Feedback
						<i
							class="fa-solid fa-circle-question text-gray-500 dark:text-slate-400 cursor-help"
							title="Gather feedback from members?"
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
						<Required />
						<i
							class="fa-solid fa-circle-question text-gray-500 dark:text-slate-400 cursor-help"
							title="Content to be sent in the opening message of each ticket."
						/>
						<textarea
							class="form-input input"
							required
							rows="4"
							maxlength="1000"
							bind:value={category.openingMessage}
						/>
					</label>
					{#if category.openingMessage}
						<p class="text-sm font-semibold mt-2 mb-1">Preview</p>
						<discord-messages
							no-background={true}
							light-theme={data.theme !== 'dark'}
							class="bloc w-full border-0"
						>
							<discord-message
								author={data.client.username}
								avatar={data.client.avatar}
								bot={true}
								timestamp={`Today at ${new Date().toLocaleTimeString('default', {
									hour: 'numeric',
									minute: 'numeric'
								})}`}
								class="py-2"
								highlight
							>
								{#if category.pingRoles?.length > 0}
									{#each category.pingRoles as id, index}
										{#if index > 0}
											{' '}
										{/if}
										<discord-mention color={getRole(id)._hexColor} type="role">
											{getRole(id).name}
										</discord-mention>
									{/each}
									, <br />
								{/if}
								<discord-mention highlight>{data.user.username}</discord-mention>
								has created a new ticket
								<discord-embed
									slot="embeds"
									color={data.settings.primaryColour}
									author-image={`https://cdn.discordapp.com/avatars/${data.user.id}/${data.user.avatar}.webp`}
									author-name={data.user.username}
									image={category.image}
								>
									<discord-embed-description slot="description">
										{@html marked
											.parse(category.openingMessage)
											.replace(
												/{+\s?(user)?name\s?}+/gi,
												`<discord-mention>${data.user.username}</discord-mention>`
											)
											.replace(/{+\s?avgResponseTime\s?}+/gi, data.guild.stats.avgResponseTime)
											.replace(/{+\s?avgResolutionTime\s?}+/gi, data.guild.stats.avgResolutionTime)}
									</discord-embed-description>
									{#if category.requireTopic}
										<discord-embed-fields slot="fields">
											<discord-embed-field field-title="Topic">
												This is a pretty good preview
											</discord-embed-field>
										</discord-embed-fields>
									{/if}
									{#if data.settings.footer}
										<discord-embed-footer slot="footer" footer-image={data.client.avatar}>
											{data.settings.footer}
										</discord-embed-footer>
									{/if}
								</discord-embed>
								<discord-attachments slot="components">
									<discord-action-row>
										{#if category.requireTopic || category.questions.length > 0}
											<discord-button type="secondary">✏️ Edit</discord-button>
										{/if}
										{#if category.claiming && data.settings.claimButton}
											<discord-button type="secondary">🙌 Claim</discord-button>
										{/if}
										{#if data.settings.closeButton}
											<discord-button type="destructive">✖️ Close</discord-button>
										{/if}
									</discord-action-row>
								</discord-attachments>
							</discord-message>
						</discord-messages>
					{/if}
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
							class="form-multiselect input font-normal h-44"
							bind:value={category.pingRoles}
						>
							{#each roles as role}
								<option value={role.id} class="p-1 m-1 rounded" style={role._style}>
									<i class="fa-solid fa-at text-gray-500 dark:text-slate-400" style={role._style} />
									{role.unicodeEmoji || ''}
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
							class="form-multiselect input font-normal h-44"
							bind:value={category.requiredRoles}
						>
							{#each roles as role}
								<option value={role.id} class="p-1 m-1 rounded" style={role._style}>
									<i class="fa-solid fa-at text-gray-500 dark:text-slate-400" style={role._style} />
									{role.unicodeEmoji || ''}
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
							disabled={category.questions.length > 0}
							bind:checked={category.requireTopic}
						/>
					</label>
				</div>
				<div>
					<label class="font-medium">
						Staff roles
						<Required />
						<i
							class="fa-solid fa-circle-question text-gray-500 dark:text-slate-400 cursor-help"
							title="Roles that will be able to view tickets."
						/>
						<select
							multiple
							required
							class="form-multiselect input font-normal h-44"
							bind:value={category.staffRoles}
						>
							{#each roles as role}
								<option value={role.id} class="p-1 m-1 rounded" style={role._style}>
									<i class="fa-solid fa-at text-gray-500 dark:text-slate-400" style={role._style} />
									{role.unicodeEmoji || ''}
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
					<div class="flex flex-col gap-4">
						<div class="text-center">
							<h3 class="font-bold text-xl">Questions</h3>
							<p class="text-gray-500 dark:text-slate-400">{category.questions.length}/5</p>
						</div>
						{#if category.questions.length > 0}
							<div>
								<label class="font-medium">
									Custom topic
									<i
										class="fa-solid fa-circle-question text-gray-500 dark:text-slate-400 cursor-help"
										title="Which question's value should be used as the ticket topic?"
									/>
									<select
										class="form-multiselect input font-normal"
										bind:value={category.customTopic}
									>
										<option value={null} class="p-1">
											<i class="fa-solid fa-at text-gray-500 dark:text-slate-400" />
											None
										</option>
										<option disabled>------------</option>
										{#each category.questions as q}
											<option value={q.id} class="p-1">
												<i class="fa-solid fa-at text-gray-500 dark:text-slate-400" />
												{q.label}
											</option>
										{/each}
									</select>
								</label>
							</div>
						{/if}
						<div>
							<CategoryQuestions bind:state={category.questions} />
						</div>
						{#if category.questions.length < 5}
							<div class="text-center">
								<button
									type="button"
									class="hover:text-green-300 text-green-500 dark:hover:text-green-500/50 dark:text-green-500 p-2 px-5 rounded-lg font-medium transition duration-300 disabled:cursor-not-allowed"
									on:click={() => {
										category.questions.push({
											id: uuidv4(),
											label: `Question ${category.questions.length + 1}`,
											maxLength: 1000,
											minLength: 0,
											options: [],
											order: category.questions.length,
											placeholder: '',
											required: true,
											style: 2,
											type: null,
											value: ''
										});
										category.questions = category.questions;
									}}
								>
									<i class="fa-solid fa-circle-plus" />
									Add
								</button>
							</div>
						{/if}
					</div>
				</div>
				<div class="flex justify-end gap-4">
					{#if category.id}
						<button
							type="button"
							disabled={loadingDelete}
							class="mt-4 bg-red-300 hover:bg-red-500 hover:text-white dark:bg-red-500/50 dark:hover:bg-red-500 dark:hover:text-white p-2 px-5 rounded-lg font-medium transition duration-300 disabled:cursor-not-allowed"
							on:click={del}
						>
							{#if loadingDelete}
								<i class="fa-solid fa-spinner animate-spin" />
							{:else}
								<i class="fa-solid fa-trash" />
							{/if}
							Delete
						</button>
					{/if}
					<button
						type="submit"
						disabled={loadingSubmit}
						class="mt-4 bg-green-300 hover:bg-green-500 hover:text-white dark:bg-green-500/50 dark:hover:bg-green-500 dark:hover:text-white p-2 px-5 rounded-lg font-medium transition duration-300 disabled:cursor-not-allowed"
					>
						{#if loadingSubmit}
							<i class="fa-solid fa-spinner animate-spin" />
						{/if}
						Submit
					</button>
				</div>
			</div>
		</div>
	</form>
</div>
