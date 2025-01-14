<script>
	
	import emoji from 'emoji-name-map';
	import { browser } from '$app/environment';
	/** @type {{data: import('./$types').PageData}} */
	let { data } = $props();

	const { categories } = data;
</script>

<h1 class="m-4 text-4xl font-bold text-center">Categories</h1>
<div class="m-2 p-4 max-w-lg mx-auto">
	<div class="grid grid-cols-1 gap-4">
		<a href="./categories/new">
			<div
				class="bg-gray-100 dark:bg-slate-800 p-4 rounded-xl shadow-sm font-semibold text-center text-lg link"
			>
				<i class="fa-solid fa-circle-plus mr-2"></i><span>Create</span>
			</div>
		</a>
		{#each categories as category}
			<a href={`./categories/${category.id}`}>
				<div
					class="bg-gray-100 dark:bg-slate-800 p-4 rounded-xl shadow-sm link group flex flex-col-reverse md:flex-row-reverse md:justify-between gap-1"
				>
					<div
						class="text-sm float-right text-gray-500 dark:text-slate-400 group-hover:text-white dark:group-hover:text-white transition duration-300 min-w-max text-center md:text-left"
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
