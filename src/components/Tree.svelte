<script>
	import Tree from './Tree.svelte';
	import { marked } from 'marked';

	/** @type {{entry?: any, indent?: number}} */
	let { entry = [], indent = 0 } = $props();
</script>

<div>
	{#if entry instanceof Array}
		{#each entry as child}
			<div class:my-4={indent > 0} class="font-mono" style="padding-left: {indent}px;">
				<!-- pt-2 (stalk) -->
				<div
					class="rounded-bl-xl border-l-2 border-dotted border-black/25 pl-2 dark:border-white/25"
				>
					<p class="font-bold text-red-700 dark:text-red-500">{child[0]}</p>
					<Tree entry={child[1]} indent={indent + 6} />
				</div>
			</div>
		{/each}
	{:else}
		<!-- text-xs -->
		<p class="prose prose-sm prose-slate ml-2 text-black/75 dark:prose-invert dark:text-white/75">
			{@html marked.parse(entry)}
		</p>
	{/if}
</div>
