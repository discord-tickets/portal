<template>
	<div>
		<router-link to='/'>Server selector</router-link>

		<div class='container is-fluid'>
			<div v-for='guild in guilds' :key='guild.id'>
				g
				{{ guild.name }}
			</div>
		</div>

	</div>
</template>

<script>

export default {
	name: 'ServerSelector',
	components: {},
	data() {
		return {};
	},
	computed: {
		guilds() {
			// console.log(this.$root.guilds)
			return this.$root.$data.guilds;
		}
	}
};
</script>

<style scoped>
.guild_logo {
	border-radius: 50%;
}
</style>