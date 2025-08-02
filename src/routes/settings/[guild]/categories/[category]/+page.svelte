<script>
	import { run, preventDefault } from 'svelte/legacy';

	import ms from 'ms';
	import emoji from 'emoji-name-map';
	import { marked } from 'marked';
	import { v4 as uuidv4 } from 'uuid';
	import CategoryQuestions from '$components/CategoryQuestions/Questions.svelte';
	import { questionsState as qS } from '$components/state.svelte';
	import Required from '$components/Required.svelte';
	import { getContext, onMount } from 'svelte';
	import { beforeNavigate } from '$app/navigation';
	import ErrorBox from '$components/ErrorBox.svelte';
	/**
	 * @typedef {Object} Props
	 * @property {import('./$types').PageData} data
	 */

	/** @type {Props} */
	let { data } = $props();

	let modified = $state(false);

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

	let { category, channels, roles, url } = $state(data);

	const buttonStyles = [
		{ name: 'Primary', value: 1 },
		{ name: 'Secondary', value: 2 },
		{ name: 'Success', value: 3 },
		{ name: 'Danger', value: 4 }
	];
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

	qS.questions = category.questions;
	channels = channels.filter((c) => c.type === 4); // category
	roles = roles.filter((r) => r.name !== '@everyone').sort((a, b) => b.rawPosition - a.rawPosition);
	roles.forEach((r) => {
		r._hexColor = r.color > 0 ? `#${r.color.toString(16).padStart(6, '0')}` : null;
		r._style = r._hexColor ? `color: ${r._hexColor}` : '';
	});

	category.cooldown = category.cooldown ? ms(category.cooldown) : '';

	let error = $state(null);
	let loadingSubmit = $state(false);
	let loadingDelete = $state(false);

	const submit = async () => {
		try {
			// error = null;
			loadingSubmit = true;
			const json = { ...category };

			if (category.discordCategory === 'new') json.discordCategory = null;
			json.cooldown = category.cooldown ? ms(category.cooldown) : null;

			if (json.name.length > 30) throw new Error(`The name is too long (${json.name.length}>30).`);

			if (json.description.length > 100)
				throw new Error(`The description is too long (${json.description.length}>100).`);

			json.questions = qS.questions.map((q) => {
				if (q.type === 'TEXT') {
					if (q.value.length > 0 && q.value.length < q.minLength)
						throw `The value of the "${q.label}" question is shorter than the minimum length.`;
					if (q.value.length > q.maxLength)
						throw `The value of the "${q.label}" question is longer than the maximum length.`;
				}
				delete q._real;
				return q;
			});

			if (json.questions.find((q) => q.id === json.customTopic) === undefined)
				json.customTopic = null;

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
				credentials: 'include'
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

	run(() => {
		category.customTopic = qS.questions.find((q) => q.id === category.customTopic)
			? category.customTopic
			: null;
	});
	// TODO: migrate
	run(() => {
		category.requireTopic = qS.questions.length > 0 ? false : category.requireTopic;
	});
</script>

<div class="mb-8 text-center text-orange-600 dark:text-orange-400">
	<p>
		<i class="fa-solid fa-triangle-exclamation"></i>
		<a
			href="https://discordtickets.app/configuration/categories"
			class="font-semibold hover:underline">Read the documentation</a
		>
		to avoid problems.
	</p>
</div>
<h1 class="m-4 text-center text-4xl font-bold">Categories</h1>
<h2 class="m-4 text-center text-2xl font-semibold text-gray-500 dark:text-slate-400">
	{emoji.get(category.emoji) ?? ''}
	{category.name || 'New category'}
</h2>
<div class="m-2 mx-auto max-w-5xl p-4 text-lg">
	{#if error}
		<ErrorBox {error} />
	{/if}
	<form onsubmit={preventDefault(() => submit())} onchange={() => (modified = true)} class="my-4">
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-12">
			<div class="grid grid-cols-1 gap-8">
				<div>
					<label class="font-medium">
						Name
						<Required />
						<i
							class="fa-solid fa-circle-question cursor-help text-gray-500 dark:text-slate-400"
							title="The name of the category"
						></i>
						<input type="text" class="input form-input" required bind:value={category.name} />
					</label>
				</div>
				<div>
					<label class="font-medium">
						Channel name
						{#if category.id}
							<Required />
						{/if}
						<i
							class="fa-solid fa-circle-question cursor-help text-gray-500 dark:text-slate-400"
							title="The name of ticket channels"
						></i>
						<input
							type="text"
							class="input form-input"
							placeholder="ticket-{'{'}num{'}'}"
							required={!!category.id}
							bind:value={category.channelName}
						/>
					</label>
					{#if category.channelName}
						<p class="mb-1 mt-2 text-sm font-semibold">Preview</p>
						<div
							class="block w-full break-words rounded-md bg-blurple/20 p-3 font-mono text-sm shadow-sm dark:bg-blurple/20"
						>
							<i class="fa-solid fa-hashtag text-gray-500 dark:text-slate-400"></i>
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
							class="fa-solid fa-circle-question cursor-help text-gray-500 dark:text-slate-400"
							title="Allow staff to claim tickets?"
						></i>
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
							class="fa-solid fa-circle-question cursor-help text-gray-500 dark:text-slate-400"
							title="How long should members have to wait before creating another ticket?"
						></i>
						<input type="text" class="input form-input" bind:value={category.cooldown} />
					</label>
				</div>
				<div>
					<label class="font-medium">
						Description
						<Required />
						<i
							class="fa-solid fa-circle-question cursor-help text-gray-500 dark:text-slate-400"
							title="What is this category for?"
						></i>
						<input
							type="text"
							class="input form-input"
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
							class="fa-solid fa-circle-question cursor-help text-gray-500 dark:text-slate-400"
							title="Which category channel should ticket channels be created under?"
						></i>
						<select class="input form-multiselect" required bind:value={category.discordCategory}>
							{#if !category.discordCategory || category.discordCategory === 'new'}
								<option value="new">Create a new category</option>
								<hr />
							{/if}
							{#each channels as channel}
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
						Button style
						{#if category.id}
							<Required />
						{/if}
						<i
							class="fa-solid fa-circle-question cursor-help text-gray-500 dark:text-slate-400"
							title="Button style used for panels"
						></i>
						<span class="text-2xl">{emoji.get(category.emoji) ?? ''}</span>
						<select class="input form-multiselect font-normal" bind:value={category.buttonStyle}>
							{#each buttonStyles as buttonStyle}
								<option
									value={buttonStyle.value}
									class="p-1"
									selected={!!category.id
										? buttonStyle.value === category.buttonStyle
										: buttonStyle.value === 2}
								>
									{buttonStyle.name}
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
							class="fa-solid fa-circle-question cursor-help text-gray-500 dark:text-slate-400"
							title="Emoji used for buttons & dropdowns"
						></i>
						<span class="text-2xl">{emoji.get(category.emoji) ?? ''}</span>
						<input type="text" class="input form-input" required bind:value={category.emoji} />
					</label>
				</div>
				<div>
					<label for="enableFeedback" class="font-medium">
						Feedback
						<i
							class="fa-solid fa-circle-question cursor-help text-gray-500 dark:text-slate-400"
							title="Gather feedback from members?"
						></i>
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
							class="fa-solid fa-circle-question cursor-help text-gray-500 dark:text-slate-400"
							title="A link to an image to be sent with the opening message."
						></i>
						<input type="url" class="input form-input" bind:value={category.image} />
					</label>
				</div>
				<div>
					<label class="font-medium">
						Member limit
						<i
							class="fa-solid fa-circle-question cursor-help text-gray-500 dark:text-slate-400"
							title="How many tickets in this category can each member have open?"
						></i>
						<input
							type="number"
							min="1"
							max="10"
							class="input form-input"
							bind:value={category.memberLimit}
						/>
					</label>
				</div>
				<div>
					<label class="font-medium">
						Opening message
						<Required />
						<i
							class="fa-solid fa-circle-question cursor-help text-gray-500 dark:text-slate-400"
							title="Content to be sent in the opening message of each ticket."
						></i>
						<textarea
							class="input form-input"
							required
							rows="4"
							maxlength="1000"
							bind:value={category.openingMessage}
						></textarea>
					</label>
					{#key category.pingRoles}
						{#key category.requireTopic}
							{#if category.openingMessage}
								<p class="mb-1 mt-2 text-sm font-semibold">Preview</p>
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
												{@const role = getRole(id)}
												{#if role}
													{#if index > 0}
														{' '}
													{/if}
													<discord-mention color={role?._hexColor} type="role">
														{role?.name}
													</discord-mention>
												{/if}
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
											<discord-embed-description slot="description" class="break-words prose prose-slate prose-sm dark:prose-invert prose-a:text-blurple">
												{@html marked
													.parse(category.openingMessage)
													.replace(
														/{+\s?(user)?name\s?}+/gi,
														`<discord-mention>${data.user.username}</discord-mention>`
													)
													.replace(/{+\s?avgResponseTime\s?}+/gi, data.guild.stats.avgResponseTime)
													.replace(
														/{+\s?avgResolutionTime\s?}+/gi,
														data.guild.stats.avgResolutionTime
													)}
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
												{#if category.requireTopic || qS.questions.length > 0}
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
						{/key}
					{/key}
				</div>
				<div>
					<label class="font-medium">
						Ping roles
						<i
							class="fa-solid fa-circle-question cursor-help text-gray-500 dark:text-slate-400"
							title="Roles that should be pinged upon ticket creation."
						></i>
						<select
							multiple
							class="input form-multiselect h-44 font-normal"
							bind:value={category.pingRoles}
						>
							{#each roles as role}
								<option value={role.id} class="m-1 rounded p-1" style={role._style}>
									<!-- <i class="fa-solid fa-at text-gray-500 dark:text-slate-400" style={role._style} /> -->
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
							class="fa-solid fa-circle-question cursor-help text-gray-500 dark:text-slate-400"
							title="Should slow mode be enabled?"
						></i>
						<select class="input form-multiselect font-normal" bind:value={category.ratelimit}>
							<option value={null} class="p-1">
								<!-- <i class="fa-solid fa-at text-gray-500 dark:text-slate-400" /> -->
								Off
							</option>
							{#each slowmodes as slowmode}
								<option value={ms(slowmode) / 1000} class="p-1">
									<!-- <i class="fa-solid fa-at text-gray-500 dark:text-slate-400" /> -->
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
							class="fa-solid fa-circle-question cursor-help text-gray-500 dark:text-slate-400"
							title="Roles that a user needs to create a ticket."
						></i>
						<select
							multiple
							class="input form-multiselect h-44 font-normal"
							bind:value={category.requiredRoles}
						>
							{#each roles as role}
								<option value={role.id} class="m-1 rounded p-1" style={role._style}>
									<!-- <i class="fa-solid fa-at text-gray-500 dark:text-slate-400" style={role._style} /> -->
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
							class="fa-solid fa-circle-question cursor-help text-gray-500 dark:text-slate-400"
							title="Require a topic before ticket creation?"
						></i>
						<input
							type="checkbox"
							id="requireTopic"
							name="requireTopic"
							class="form-checkbox"
							disabled={qS.questions.length > 0}
							bind:checked={category.requireTopic}
						/>
					</label>
				</div>
				<div>
					<label class="font-medium">
						Staff roles
						<Required />
						<i
							class="fa-solid fa-circle-question cursor-help text-gray-500 dark:text-slate-400"
							title="Roles that will be able to view tickets."
						></i>
						<select
							multiple
							required
							class="input form-multiselect h-44 font-normal"
							bind:value={category.staffRoles}
						>
							{#each roles as role}
								<option value={role.id} class="m-1 rounded p-1" style={role._style}>
									<!-- <i class="fa-solid fa-at text-gray-500 dark:text-slate-400" style={role._style} /> -->
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
							class="fa-solid fa-circle-question cursor-help text-gray-500 dark:text-slate-400"
							title="The total number of tickets that can be open at once."
						></i>
						<input
							type="number"
							min="1"
							max="50"
							class="input form-input"
							bind:value={category.totalLimit}
						/>
					</label>
				</div>
			</div>
			<div>
				<div class="rounded-xl bg-white p-4 shadow-sm dark:bg-slate-700">
					<div class="flex flex-col gap-4">
						<div class="text-center">
							<h3 class="text-xl font-bold">Questions</h3>
							<p class="text-gray-500 dark:text-slate-400">{qS.questions.length}/5</p>
						</div>
						{#if qS.questions.length > 0}
							<div>
								<label class="font-medium">
									Custom topic
									<i
										class="fa-solid fa-circle-question cursor-help text-gray-500 dark:text-slate-400"
										title="Which question's value should be used as the ticket topic?"
									></i>
									<select
										class="input form-multiselect font-normal"
										bind:value={category.customTopic}
									>
										<option value={null} class="p-1">
											<!-- <i class="fa-solid fa-at text-gray-500 dark:text-slate-400" /> -->
											None
										</option>
										<hr />
										{#each qS.questions as q}
											<option value={q.id} class="p-1">
												<!-- <i class="fa-solid fa-at text-gray-500 dark:text-slate-400" /> -->
												{q.label}
											</option>
										{/each}
									</select>
								</label>
							</div>
						{/if}
						<div>
							<CategoryQuestions />
						</div>
						{#if qS.questions.length < 5}
							<div class="text-center">
								<button
									type="button"
									class="rounded-lg p-2 px-5 font-medium text-green-500 transition duration-300 hover:text-green-300 disabled:cursor-not-allowed dark:text-green-500 dark:hover:text-green-500/50"
									onclick={() => {
										qS.questions.push({
											id: uuidv4(),
											label: `Question ${qS.questions.length + 1}`,
											maxLength: 1000,
											minLength: 0,
											options: [],
											order: qS.questions.length,
											placeholder: '',
											required: true,
											style: 2,
											type: null,
											value: '',
											_real: false
										});
									}}
								>
									<i class="fa-solid fa-circle-plus"></i>
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
							class="mt-4 rounded-lg bg-red-300 p-2 px-5 font-medium transition duration-300 hover:bg-red-500 hover:text-white disabled:cursor-not-allowed dark:bg-red-500/50 dark:hover:bg-red-500 dark:hover:text-white"
							onclick={del}
						>
							{#if loadingDelete}
								<i class="fa-solid fa-spinner animate-spin"></i>
							{:else}
								<i class="fa-solid fa-trash"></i>
							{/if}
							Delete
						</button>
					{/if}
					<button
						type="submit"
						disabled={loadingSubmit}
						class="mt-4 rounded-lg bg-green-300 p-2 px-5 font-medium transition duration-300 hover:bg-green-500 hover:text-white disabled:cursor-not-allowed dark:bg-green-500/50 dark:hover:bg-green-500 dark:hover:text-white"
					>
						{#if loadingSubmit}
							<i class="fa-solid fa-spinner animate-spin"></i>
						{/if}
						Submit
					</button>
				</div>
			</div>
		</div>
	</form>
</div>
