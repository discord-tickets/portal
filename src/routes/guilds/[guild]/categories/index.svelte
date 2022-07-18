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
		const response = await fetch(url, fetchOptions);
		const body = response.status < 500 ? await response.json() : null;
		return {
			status: response.status,
			error: !response.ok ? body?.message || String(response.status) : null,
			props: {
				url,
				categories: body
			}
		};
	}
</script>

<script>
	export let categories;
	import emoji from 'emoji-name-map';
	import { browser } from '$app/env';
</script>

<h1 class="m-4 text-4xl font-bold text-center">Categories</h1>
<div class="m-2 p-4 max-w-lg mx-auto">
	<div class="grid grid-cols-1 gap-4">
		<a href="./categories/new">
			<div
				class="bg-gray-100 dark:bg-slate-800 p-4 rounded-xl shadow-sm font-semibold text-center text-lg link"
			>
				<i class="fa-solid fa-circle-plus mr-2" /><span>Create</span>
			</div>
		</a>
		{#each categories as category}
			<a href={`./categories/${category.id}`}>
				<div class="bg-gray-100 dark:bg-slate-800 p-4 rounded-xl shadow-sm link group">
					{#if browser}
						<p
							class="text-sm float-right text-gray-500 dark:text-slate-400 group-hover:text-white dark:group-hover:text-white"
						>
							<i class="fa-solid fa-calendar-days" />
							Created on
							{new Intl.DateTimeFormat(navigator.languages[0]).format(new Date(category.createdAt))}
						</p>
					{/if}
					<div class="flex items-start gap-4">
						<span class="text-5xl">
							{#if category.emoji}
								{emoji.get(category.emoji) ?? ''}
							{/if}
						</span>
						<div>
							<p class="text-xl font-semibold">
								<span>
									{category.name}
								</span>
							</p>
							<p>
								{category.description}
							</p>
						</div>
					</div>
				</div>
			</a>
		{/each}
	</div>
</div>
