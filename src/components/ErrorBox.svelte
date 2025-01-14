<script>
	import Tree from '$components/Tree.svelte';
	import { flatten } from '$lib/util/data';
	/** @type {{error?: any, boxStyles?: string}} */
	let { error = {}, boxStyles = 'bg-red-400/40 dark:bg-red-500/20' } = $props();

	console.error(error);
</script>

<div id="error" class="mx-auto my-8 max-w-xl overflow-x-auto break-words">
	<div class={`${boxStyles} flex flex-col gap-4 rounded-lg px-6 py-4 text-sm`}>
		<p class="my-2 text-center text-xl font-bold text-black dark:text-white">
			Sorry, something went wrong.
		</p>
		<div>
			<p class="font-mono text-sm">
				<span class="font-bold text-black dark:text-white">Error</span>
			</p>
			<Tree entry={flatten(error)} />
		</div>
	</div>
</div>
