<script>
	import { base } from '$app/paths';
	import { page } from '$app/stores';
</script>

<h1 class="m-4 text-center text-4xl font-bold">Feedback</h1>
<div class="mx-auto my-8 max-w-lg text-center">
	<div class="my-8">
		<img
			src={`${base}/assets/undraw_reviews.svg`}
			alt="Reviews illustration"
			width="70%"
			height="auto"
			class="mx-auto"
		/>
	</div>
	<div class="my-8 text-lg font-semibold">
		<a
			href={`${base}/${$page.params.guild}/feedback`}
			class="transition duration-300 hover:text-blurple"
		>
			View feedback in the portal
			<i class="fa-solid fa-arrow-right-long"></i>
		</a>
	</div>
</div>
