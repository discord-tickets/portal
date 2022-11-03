<script>
	/** @type {import('./$types').PageData} */
	export let data;

	import { base } from '$app/paths';

	const { client } = data;
</script>

<h1 class="m-4 text-4xl font-bold text-center">Feedback</h1>
<div class="text-center max-w-lg mx-auto my-8">
	<div class="my-8">
		<img
			src={`${base}/img/undraw_reviews.svg`}
			alt="Reviews illustration"
			width="70%"
			height="auto"
			class="mx-auto"
		/>
	</div>
	<div class="my-8 text-lg font-semibold">
		<a href="/feedback" class="hover:text-blurple transition duration-300">
			View feedback in the portal
			<i class="fa-solid fa-arrow-right-long" />
		</a>
	</div>
</div>
