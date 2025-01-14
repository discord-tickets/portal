<script>
	import { preventDefault } from 'svelte/legacy';

	import { page } from '$app/stores';
	import zones from '$lib/timezones.json';
	import ms from 'ms';
	import { fade } from 'svelte/transition';
	import Required from '$components/Required.svelte';
	import { onMount } from 'svelte';
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

	onMount(() => {
		window.addEventListener('beforeunload', (event) => {
			if (modified) {
				event.preventDefault();
				event.returnValue = '';
			}
		});
	});

	let { settings, channels, locales, roles } = $state(data);

	const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	const expanded = $state({ workingHours: false });

	channels = channels.filter((c) => c.type === 0); // text
	roles = roles.filter((r) => r.name !== '@everyone').sort((a, b) => b.rawPosition - a.rawPosition);
	roles.forEach((r) => {
		r._hexColor = r.color > 0 ? `#${r.color.toString(16).padStart(6, '0')}` : null;
		r._style = r._hexColor ? `color: ${r._hexColor}` : '';
	});
	settings.autoClose = settings.autoClose ? ms(settings.autoClose) : '';
	settings.logChannel = settings.logChannel ?? '';
	settings.staleAfter = settings.staleAfter ? ms(settings.staleAfter) : '';
	settings.workingHours = settings.workingHours.map((v) => (v === null ? [] : v));

	let autoTag = $state(Array.isArray(settings.autoTag) ? 'custom' : settings.autoTag); // there are 2 inputs for autoTag, need separate variables
	let error = $state(null);
	let loading = $state(false);

	const submit = async () => {
		try {
			// error = null;
			loading = true;
			const json = { ...settings };
			json.autoClose = settings.autoClose ? ms(settings.autoClose) : null;
			json.staleAfter = settings.staleAfter ? ms(settings.staleAfter) : null;
			// if (json.autoClose !== null && json.staleAfter === null)
			// 	throw new Error('autoClose cannot be set unless staleAfter is also set.');
			if (autoTag !== 'custom') json.autoTag = autoTag;
			else if (!Array.isArray(settings.autoTag)) json.autoTag = []; // it only updates if you select (and optionally deselect) a channel
			if (settings.logChannel === '') json.logChannel = null;
			json.workingHours = settings.workingHours.map((v) => (v.length === 0 ? null : v));

			const response = await fetch(`/api/admin/guilds/${$page.params.guild}/settings`, {
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
				modified = false;
				window.location = './';
			}
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

<h1 class="m-4 text-center text-4xl font-bold">General settings</h1>
<div class="m-2 mx-auto max-w-lg p-4 text-lg">
	{#if error}
		<ErrorBox {error} />
	{/if}
	<div class="mb-8 text-center text-orange-600 dark:text-orange-400">
		<p class="font-semibold"><i class="fa-solid fa-triangle-exclamation"></i> Warning</p>
		<p>
			This page is made to be "just about functional".
			<a
				href="https://discordtickets.app/configuration/general"
				class="font-semibold hover:underline">Read the documentation</a
			>
			to avoid breaking something.
		</p>
	</div>
	<form onsubmit={preventDefault(() => submit())} onchange={() => (modified = true)}>
		<div class="my-4 grid grid-cols-1 gap-8">
			<div>
				<label class="font-medium">
					Auto close after
					<i
						class="fa-solid fa-circle-question cursor-help text-gray-500 dark:text-slate-400"
						title="How long should the bot wait before closing (for close command and stale tickets)?"
					></i>
					<input type="text" class="input form-input" bind:value={settings.autoClose} />
				</label>
			</div>
			<div>
				<label class="font-medium">
					Auto tag channels
					<i
						class="fa-solid fa-circle-question cursor-help text-gray-500 dark:text-slate-400"
						title="Which channels should the bot respond with tags in?"
					></i>
					<select class="input form-multiselect block font-normal" bind:value={autoTag}>
						<option value="custom">Specific channels</option>
						<option value="ticket">Only ticket channels</option>
						<option value="!ticket">All non-ticket channels</option>
						<option value="all">All channels</option>
					</select>
					{#if autoTag === 'custom'}
						<select
							multiple
							class="input form-multiselect font-normal"
							bind:value={settings.autoTag}
						>
							{#each channels as channel}
								<option value={channel.id} class="m-1 rounded p-1">
									<!-- <i class="fa-solid fa-hashtag text-gray-500 dark:text-slate-400" /> -->
									{channel.name}
								</option>
							{/each}
						</select>
					{/if}
				</label>
			</div>
			<div>
				<label for="archive" class="font-medium">
					Archive
					<i
						class="fa-solid fa-circle-question cursor-help text-gray-500 dark:text-slate-400"
						title="Save messages sent in tickets for future use?"
					></i>
					<input
						type="checkbox"
						id="archive"
						name="archive"
						class="form-checkbox"
						bind:checked={settings.archive}
					/>
				</label>
			</div>
			<div>
				<label class="font-medium">
					Blocklist
					<i
						class="fa-solid fa-circle-question cursor-help text-gray-500 dark:text-slate-400"
						title="Which roles should the bot ignore?"
					></i>
					<select
						multiple
						class="input form-multiselect h-44 font-normal"
						bind:value={settings.blocklist}
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
				<div class="font-medium">
					Buttons
					<i
						class="fa-solid fa-circle-question cursor-help text-gray-500 dark:text-slate-400"
						title="Which buttons should be enabled (if the feature is enabled in the category)?"
					></i>
					<div class="mx-4">
						<div>
							<label for="claimButton" class="text-base font-medium">
								Claim
								<i
									class="fa-solid fa-circle-question cursor-help text-gray-500 dark:text-slate-400"
									title="Add a claim/unclaim button to the opening message (if enabled in category)?"
								></i>
								<input
									type="checkbox"
									id="claimButton"
									name="claimButton"
									class="form-checkbox"
									bind:checked={settings.claimButton}
								/>
							</label>
						</div>
						<div>
							<label for="closeButton" class="text-base font-medium">
								Close
								<i
									class="fa-solid fa-circle-question cursor-help text-gray-500 dark:text-slate-400"
									title="Add a close button to the opening message?"
								></i>
								<input
									type="checkbox"
									id="closeButton"
									name="closeButton"
									class="form-checkbox"
									bind:checked={settings.closeButton}
								/>
							</label>
						</div>
					</div>
				</div>
			</div>
			<div>
				<label class="font-medium">
					Error colour
					<i
						class="fa-solid fa-circle-question cursor-help text-gray-500 dark:text-slate-400"
						title="What colour should error embeds be?"
					></i>
					<input type="text" class="input form-input" bind:value={settings.errorColour} />
				</label>
			</div>
			<div>
				<label class="font-medium">
					Footer
					<i
						class="fa-solid fa-circle-question cursor-help text-gray-500 dark:text-slate-400"
						title="What text should be at the bottom of embeds?"
					></i>
					<input type="text" class="input form-input" bind:value={settings.footer} />
				</label>
			</div>
			<div>
				<label class="font-medium">
					Locale
					<i
						class="fa-solid fa-circle-question cursor-help text-gray-500 dark:text-slate-400"
						title="Which language should the bot respond in?"
					></i>
					<select class="input form-multiselect" bind:value={settings.locale}>
						{#each locales as locale}
							<option value={locale} class="p-1">
								<!-- <i class="fa-solid fa-hashtag text-gray-500 dark:text-slate-400" /> -->
								{locale}
							</option>
						{/each}
					</select>
				</label>
			</div>
			<div>
				<label class="font-medium">
					Log channel
					<i
						class="fa-solid fa-circle-question cursor-help text-gray-500 dark:text-slate-400"
						title="Which channel should logs be sent to?"
					></i>
					<select class="input form-multiselect" bind:value={settings.logChannel}>
						<option value="">None</option>
						<hr />
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
					Primary colour
					<i
						class="fa-solid fa-circle-question cursor-help text-gray-500 dark:text-slate-400"
						title="What colour should normal embeds be?"
					></i>
					<input type="text" class="input form-input" bind:value={settings.primaryColour} />
				</label>
			</div>
			<div>
				<label class="font-medium">
					Stale after
					<i
						class="fa-solid fa-circle-question cursor-help text-gray-500 dark:text-slate-400"
						title="When should the bot remind members/staff about messages with no reply?"
					></i>
					<input type="text" class="input form-input" bind:value={settings.staleAfter} />
				</label>
			</div>
			<div>
				<label class="font-medium">
					Success colour
					<i
						class="fa-solid fa-circle-question cursor-help text-gray-500 dark:text-slate-400"
						title="What colour should success embeds be?"
					></i>
					<input type="text" class="input form-input" bind:value={settings.successColour} />
				</label>
			</div>
			<div>
				<div class="grid grid-cols-1 gap-2 font-medium">
					<div>
						Working hours
						<i
							class="fa-solid fa-circle-question cursor-help text-gray-500 dark:text-slate-400"
							title="When can your members expect staff to be available?"
						></i>
						<p
							class="cursor-pointer select-none text-gray-500 transition duration-300 hover:text-blurple dark:text-slate-400 dark:hover:text-blurple"
							onclick={() => (expanded.workingHours = !expanded.workingHours)}
						>
							<i
								class="fa-solid {expanded.workingHours
									? 'fa-angle-up'
									: 'fa-angle-down'} float-right text-xl"
							></i>
							<span class="text-sm"> Click to {expanded.workingHours ? 'collapse' : 'expand'}</span>
						</p>
					</div>

					{#if expanded.workingHours}
						<div in:fade out:fade>
							<div class="mx-4">
								<label>
									<p class="text-base">
										Timezone
										<Required />
									</p>
									<input
										type="text"
										list="timezones"
										class="input form-input"
										required
										bind:value={settings.workingHours[0]}
									/>
									<datalist id="timezones" class="">
										{#each zones as zone}
											<option value={zone} class="p-1">
												{zone}
											</option>
										{/each}
									</datalist>
								</label>
								{#each days as day, index}
									<label for={day}>
										<p class="text-base">{day}</p>
										<div class="flex items-center">
											<input
												type="time"
												class="form-input m-2 grow rounded-md border-transparent bg-gray-100 text-center font-normal shadow-sm focus:border-2 focus:border-blurple focus:bg-white focus:ring-0 dark:bg-slate-800"
												bind:value={settings.workingHours[index + 1][0]}
											/>
											<i class="fa-solid fa-arrow-right-long"></i>
											<input
												type="time"
												class="form-input m-2 grow rounded-md border-transparent bg-gray-100 text-center font-normal shadow-sm focus:border-2 focus:border-blurple focus:bg-white focus:ring-0 dark:bg-slate-800"
												bind:value={settings.workingHours[index + 1][1]}
											/>
										</div>
									</label>
								{/each}
							</div>
						</div>
					{/if}
				</div>
			</div>
		</div>
		<button
			type="submit"
			disabled={loading}
			class="float-right mt-4 rounded-lg bg-green-300 p-2 px-5 font-medium transition duration-300 hover:bg-green-500 hover:text-white disabled:cursor-not-allowed dark:bg-green-500/50 dark:hover:bg-green-500 dark:hover:text-white"
		>
			{#if loading}
				<i class="fa-solid fa-spinner animate-spin"></i>
			{/if}
			Submit
		</button>
	</form>
</div>
