<script>
	import Tree from '$components/Tree.svelte';
	import { flatten } from '$lib/util/data';
	/** @type {{error?: any, boxStyles?: string}} */
	let { error = {}, boxStyles = 'bg-red-400/40 dark:bg-red-500/20' } = $props();

	console.error(error);
</script>

<div id="error" class="break-words max-w-xl mx-auto my-8 overflow-x-auto">
	<div class={`${boxStyles} rounded-lg py-4 px-6 text-sm flex flex-col gap-4`}>
		<p class="font-bold text-xl my-2 text-black dark:text-white text-center">
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
