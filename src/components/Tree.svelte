<script>
	import { marked } from 'marked';

	export let entry = [];
	export let indent = 0;
</script>

<div>
	{#if entry instanceof Array}
		{#each entry as child}
			<div class:my-4={indent > 0} class="font-mono" style="padding-left: {indent}px;">
				<!-- pt-2 (stalk) -->
				<div
					class="pl-2 border-l-2 border-black/25 dark:border-white/25 border-dotted rounded-bl-xl"
				>
					<p class="font-bold text-red-700 dark:text-red-500">{child[0]}</p>
					<svelte:self entry={child[1]} indent={indent + 6} />
				</div>
			</div>
		{/each}
	{:else}
		<!-- text-xs -->
		<p class="ml-2 text-black/75 dark:text-white/75 prose prose-slate prose-sm dark:prose-invert">
			{@html marked.parse(entry)}
		</p>
	{/if}
</div>
