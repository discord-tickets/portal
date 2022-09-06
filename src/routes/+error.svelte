<script>
	import { page } from '$app/stores';
</script>

<div class="text-center">
	<div
		class="bg-red-400 dark:bg-red-500 text-red-800 dark:text-red-400 bg-opacity-40 dark:bg-opacity-20 m-4 p-6 px-12 rounded-lg text-center max-w-lg inline-block"
	>
		<p class="font-semibold text-xl">Error {$page.status}</p>
		<p>{$page.error?.message ?? ''}</p>
	</div>
</div>
