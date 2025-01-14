<script>
	import { page } from '$app/stores';
	import Tree from '$components/Tree.svelte';
	import { flatten } from '$lib/util/data';
	/** @type {{boxStyles?: string}} */
	let { boxStyles = '' } = $props();

	console.error($page.error);
</script>

<div class="container mx-auto">
	<div class="my-12 flex justify-center lg:my-24">
		<div class="flex flex-col gap-8">
			<h1 class="text-center text-4xl font-bold text-black dark:text-white">
				Sorry, something went wrong.
			</h1>
			<p class="text-center text-xl">
				Your request failed with HTTP status
				<span class="font-mono">{$page.status}</span>.
			</p>
			<div class={`${boxStyles} flex flex-col gap-4 rounded-lg px-6 py-4 text-sm`}>
				<div class="font-mono text-xs">
					<p class="my-2">
						<span class="font-bold text-black dark:text-white">URL:</span>
						{$page.url}
					</p>
					<p class="my-2">
						<span class="font-bold text-black dark:text-white">Route:</span>
						{$page.route.id}
					</p>
				</div>
				<div>
					<p class="font-mono text-sm">
						<span class="font-bold text-black dark:text-white">Error</span>
					</p>
					<Tree entry={flatten($page.error)} />
				</div>
				{#if $page.params && Object.keys($page.params).length > 0}
					<div>
						<p class="font-mono text-sm">
							<span class="font-bold text-black dark:text-white">Parameters</span>
						</p>
						<Tree entry={flatten($page.params)} />
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>
