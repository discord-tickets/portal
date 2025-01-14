<script>
	import emoji from 'emoji-name-map';
	import { browser } from '$app/environment';
	/** @type {{data: import('./$types').PageData}} */
	let { data } = $props();

	const { categories } = data;
</script>

<h1 class="m-4 text-center text-4xl font-bold">Categories</h1>
<div class="m-2 mx-auto max-w-lg p-4">
	<div class="grid grid-cols-1 gap-4">
		<a href="./categories/new">
			<div
				class="link rounded-xl bg-gray-100 p-4 text-center text-lg font-semibold shadow-sm dark:bg-slate-800"
			>
				<i class="fa-solid fa-circle-plus mr-2"></i><span>Create</span>
			</div>
		</a>
		{#each categories as category}
			<a href={`./categories/${category.id}`}>
				<div
					class="link group flex flex-col-reverse gap-1 rounded-xl bg-gray-100 p-4 shadow-sm dark:bg-slate-800 md:flex-row-reverse md:justify-between"
				>
					<div
						class="float-right min-w-max text-center text-sm text-gray-500 transition duration-300 group-hover:text-white dark:text-slate-400 dark:group-hover:text-white md:text-left"
					>
						{#if browser}
							<p>
								<i class="fa-solid fa-calendar-days mr-2"></i>
								Created
								{new Intl.DateTimeFormat('default').format(new Date(category.createdAt))}
							</p>
						{/if}
						<p>
							<i class="fa-solid fa-clock mr-2"></i>
							{category.stats.avgResponseTime}
							response
						</p>
						<p>
							<i class="fa-solid fa-square-check mr-2"></i>
							{category.stats.avgResolutionTime}
							resolution
						</p>
					</div>
					<div class="flex items-center gap-4">
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
