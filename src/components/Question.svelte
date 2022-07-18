<script>
	export let name, state
</script>
<p on:click={()=> state += 1}>
	{name}: {state}
</p>