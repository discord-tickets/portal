<script>
	import { page } from '$app/stores';
	import Tree from '$components/Tree.svelte';
	console.error($page.error);
	function flatten(object, prefix) {
		const entries = [];
		for (let [k, v] of Object.entries(object)) {
			if (typeof v === 'string') {
				try {
					v = flatten(JSON.parse(v), k);
				} catch {}
			} else if (typeof v === 'object') {
				v = flatten(v, k);
			}
			// entries.push([prefix ? `${prefix}.${k}` : k, v]);
			entries.push([k, v]);
		}
		return entries;
	}
	const error = flatten($page.error);
</script>

<div class="container mx-auto">
	<div class="flex justify-center my-12 lg:my-24">
		<div class="flex flex-col gap-8">
			<h1 class="font-bold text-4xl text-black dark:text-white  text-center">Sorry, something went wrong.</h1>
			<p class="text-xl text-center">
				Your request failed with HTTP status
				<span class="font-mono">{$page.status}</span>.
			</p>
			<div class="bg-red-400/20 dark:bg-red-800/10 rounded-lg px-6">
				<Tree entry={error}></Tree>
			</div>
		</div>
	</div>
</div>
