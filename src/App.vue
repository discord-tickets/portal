<template>
  <div>
	<Navbar/>
	<section>
		<router-view/>
	</section>
  </div>
</template>

<script>
// @ is an alias to /src
import Navbar from '@/components/Navbar.vue';

export default {
	name: 'App',
	components: {
		Navbar
	}
};
</script>

