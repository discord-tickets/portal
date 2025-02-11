<script>
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { navigating } from '$app/stores';
	// import { Modals } from 'svelte-modals';
	import Spinner from '$components/Spinner.svelte';
	/** @type {{children?: import('svelte').Snippet}} */
	let { children } = $props();

	let mounted = $state(false);
	onMount(() => {
		mounted = true;
		return () => (mounted = false);
	});
</script>

<div
	class="absolute h-max min-h-screen w-full bg-dgrey-100 text-dgrey-600 dark:bg-dgrey-800 dark:text-dgrey-300"
>
	<!-- <Modals>
		{#snippet backdrop({ close })}
			<div class="backdrop" transition:fade onclick={close} onkeypress={close}></div>
		{/snippet}
		{#snippet loading()}
			<div><Spinner /></div>
		{/snippet}
	</Modals> -->
	{#if $navigating || !mounted}
		<div class="h-dvh flex items-center justify-center">
			<Spinner />
		</div>
	{:else}
		{@render children?.()}
	{/if}
</div>
