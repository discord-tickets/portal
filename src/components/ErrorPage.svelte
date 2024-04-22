<script>
	export let boxStyles = '';
	import { page } from '$app/stores';
	import Tree from '$components/Tree.svelte';
	console.error($page.error);
	function flatten(object) {
		const entries = [];
		for (let [k, v] of Object.entries(object)) {
			if (typeof v === 'string') {
				try {
					v = JSON.parse(v);
					if (typeof v === 'object') {
						v = flatten(v);
					}
				} catch {}
			} else if (typeof v === 'object') {
				v = flatten(v);
			}
			entries.push([k, v]);
		}
		return entries;
	}
</script>

<div class="container mx-auto">
	<div class="flex justify-center my-12 lg:my-24">
		<div class="flex flex-col gap-8">
			<h1 class="font-bold text-4xl text-black dark:text-white text-center">
				Sorry, something went wrong.
			</h1>
			<p class="text-xl text-center">
				Your request failed with HTTP status
				<span class="font-mono">{$page.status}</span>.
			</p>
			<div class={`${boxStyles} rounded-lg py-4 px-6 text-sm flex flex-col gap-4`}>
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
					<Tree entry={flatten($page.error)}></Tree>
				</div>
				{#if $page.params && Object.keys($page.params).length > 0}
					<div>
						<p class="font-mono text-sm">
							<span class="font-bold text-black dark:text-white">Parameters</span>
						</p>
						<Tree entry={flatten($page.params)}></Tree>
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>
