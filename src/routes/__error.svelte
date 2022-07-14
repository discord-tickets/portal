<script context="module">
	/** @type {import('@sveltejs/kit').Load} */ export function load({ error, status }) {
		return {
			props: {
				error,
				status
			}
		};
	}
</script>

<script>
	export let error;
	export let status;
</script>

<div class="text-center">
	<div
		class="bg-red-400 dark:bg-red-500 text-red-800 dark:text-red-400 bg-opacity-40 dark:bg-opacity-20 m-4 p-6 px-12 rounded-lg text-center max-w-lg inline-block"
	>
		<p class="font-semibold text-xl">Error {status}</p>
		<p>{error.message}</p>
	</div>
</div>
