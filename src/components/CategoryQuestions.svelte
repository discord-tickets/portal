<script>
	export let state;
	import DragDropList from 'svelte-dragdroplist';
</script>

 <!-- class="flex flex-col gap-2" -->

<div class="bg-gray-100 dark:bg-slate-800 p-4 rounded-xl">..</div>
<div class="bg-gray-100 dark:bg-slate-800 p-4 rounded-xl">..</div>

<DragDropList bind:data={state} />