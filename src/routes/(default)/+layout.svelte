<script>
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { navigating } from '$app/stores';
	import { Modals, closeModal } from 'svelte-modals';
	import Spinner from '$components/Spinner.svelte';

	let mounted = false;
	onMount(() => {
		mounted = true;
		return () => (mounted = false);
	});
</script>

<div
	class="bg-dgrey-100 dark:bg-dgrey-800 text-dgrey-600 dark:text-dgrey-300 min-h-screen h-max w-full absolute"
>
	<Modals>
		<div
			slot="backdrop"
			class="backdrop"
			transition:fade
			on:click={closeModal}
			on:keypress={closeModal}
		/>
		<div slot="loading">
			<Spinner />
		</div>
	</Modals>
	{#if $navigating || !mounted}
		<Spinner />
	{:else}
		<slot />
	{/if}
</div>
