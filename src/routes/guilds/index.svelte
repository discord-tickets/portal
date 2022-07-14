<script context="module">
	/** @type {import('./__types/[slug]').Load} */
	export async function load() {
		return {
			status: 301,
			redirect: `/`
		};
	}
</script>
