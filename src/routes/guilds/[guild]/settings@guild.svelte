<script context="module">
	const host = import.meta.env.PROD ? '' : import.meta.env.VITE_HOST;
	/** @type {import('./__types/[slug]').Load} */
	export async function load({ params, fetch, session, stuff }) {
		const url = `${host}/api/admin/guilds/${params.guild}/settings`;
		const fetchOptions = {
			credentials: 'include',
			headers: {
				'Content-type': 'application/json; charset=UTF-8'
			}
		};
		const response = await fetch(url, fetchOptions);
		const body = response.status < 500 ? await response.json() : null;
		return {
			status: response.status,
			error: !response.ok ? body?.message || String(response.status) : null,
			props: {
				url,
				settings: body,
				channels: await (
					await fetch(`${host}/api/admin/guilds/${params.guild}/data?query=channels.cache`, fetchOptions)
				).json(),
				roles: await (
					await fetch(`${host}/api/admin/guilds/${params.guild}/data?query=roles.cache`, fetchOptions)
				).json()
			}
		};
	}
</script>

<script>
	export let settings;
	export let channels;
	export let roles;
	export let url;

	channels = channels.filter((c) => c.type === 'GUILD_TEXT');
	roles = roles.filter((r) => r.name !== '@everyone');
	settings.autoTag = settings.autoTag ?? '';
	settings.logChannel = settings.logChannel ?? '';

	let autoTag = settings.autoTag;
	let error = '';
	let loading = false;

	const submit = async () => {
		console.log(settings);
		loading = true;
		const response = await fetch(url, {
			method: 'PATCH',
			body: JSON.stringify(settings),
			credentials: 'include',
			headers: {
				'Content-type': 'application/json; charset=UTF-8'
			}
		});
		const body = await response.json();
		console.log(response);
		console.log(body);
		loading = false;
		if (!response.ok) error = body;
		else window.location = './';
	};
</script>

<div class="m-2 p-4 max-w-lg mx-auto text-lg">
	{#if error.length !== 0}
		<div class="text-center">
			<div
				class="bg-red-400 dark:bg-red-500 text-red-800 dark:text-red-400 bg-opacity-40 dark:bg-opacity-20 m-2 p-6 px-12 rounded-lg text-center max-w-lg inline-block"
			>
				<p class="font-semibold text-xl">Error</p>
				{error}
			</div>
		</div>
	{/if}
	<form on:submit|preventDefault={() => submit()}>
		<div class="my-4 grid grid-cols-1 gap-6">
			<div>
				<label class="font-medium">
					Auto tag channels
					<i
						class="fa-solid fa-circle-question text-gray-500 dark:text-slate-400 cursor-help"
						title="Which channels should the bot respond with tags in?"
					/>
					<select class="form-multiselect block input font-normal" bind:value={autoTag}>
						<option value="">None</option>
						<option value="ticket">Only ticket channels</option>
						<option value="!ticket">All non-ticket channels</option>
						<option value="all">All channels</option>
						<option value="custom">Specific channels</option>
					</select>
					{#if autoTag === 'custom'}
						<select
							multiple
							class="form-multiselect input font-normal"
							bind:value={settings.autoTag}
						>
							{#each channels as channel}
								<option value={channel.id} class="p-1">
									<i class="fa-solid fa-hashtag text-gray-500 dark:text-slate-400" />
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
						class="fa-solid fa-circle-question text-gray-500 dark:text-slate-400 cursor-help"
						title="Save messages sent in tickets for future use?"
					/>
					<input
						type="checkbox"
						id="archive"
						name="archive"
						class="form-checkbox rounded text-blurple focus:ring-blurple cursor-pointer p-3 block m-2"
						bind:checked={settings.archive}
					/>
				</label>
			</div>
			<div>
				<label class="font-medium">
					Blocklist
					<i
						class="fa-solid fa-circle-question text-gray-500 dark:text-slate-400 cursor-help"
						title="Which roles should the bot ignore?"
					/>
					<select
						multiple
						class="form-multiselect input font-normal"
						bind:value={settings.blocklist}
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
					Error colour
					<i
						class="fa-solid fa-circle-question text-gray-500 dark:text-slate-400 cursor-help"
						title="What colour should error embeds be?"
					/>
					<input type="text" class="form-input input" bind:value={settings.errorColour} />
				</label>
			</div>
			<div>
				<label class="font-medium">
					Footer
					<i
						class="fa-solid fa-circle-question text-gray-500 dark:text-slate-400 cursor-help"
						title="What text should be at the bottom of embeds?"
					/>
					<input type="text" class="form-input input" bind:value={settings.footer} />
				</label>
			</div>
			<div>
				<label class="font-medium">
					Log Channel
					<i
						class="fa-solid fa-circle-question text-gray-500 dark:text-slate-400 cursor-help"
						title="Which channel should logs be sent to?"
					/>
					<select class="form-multiselect input" bind:value={settings.logChannel}>
						<option value="">None</option>
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
					Primary colour
					<i
						class="fa-solid fa-circle-question text-gray-500 dark:text-slate-400 cursor-help"
						title="What colour should normal embeds be?"
					/>
					<input type="text" class="form-input input" bind:value={settings.primaryColour} />
				</label>
			</div>
			<div>
				<label class="font-medium">
					Success colour
					<i
						class="fa-solid fa-circle-question text-gray-500 dark:text-slate-400 cursor-help"
						title="What colour should success embeds be?"
					/>
					<input type="text" class="form-input input" bind:value={settings.successColour} />
				</label>
			</div>
		</div>
		<button
			type="submit"
			disabled={loading}
			class="float-right bg-green-300 hover:bg-green-500 hover:text-white dark:bg-green-500/20 dark:hover:bg-green-500 dark:hover:text-white p-2 px-5 rounded-lg font-medium transition duration-300 disabled:cursor-not-allowed"
		>
			{#if loading}
				<i class="fa-solid fa-spinner animate-spin" />
			{/if}
			Submit
		</button>
	</form>
</div>
