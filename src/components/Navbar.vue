<template>
	<b-navbar class='is-light'>
		<template #brand>
			<b-navbar-item href='https://discordtickets.app'>
                <img
				src='../assets/img/text-with-icon.png'
				alt= 'DT' />
			</b-navbar-item>
		</template>
		<template #start>
			<b-navbar-item>
				<router-link to='/'>
					Server selector
				</router-link>
			</b-navbar-item>
			<b-navbar-item href='https://discordtickets.app'>
				Documentation
			</b-navbar-item>
			<b-navbar-item href='https://go.eartharoid.me/discord'>
				Support
			</b-navbar-item>
		</template>

		<template #end>
			<!-- <b-navbar-item tag='div'>
				<div class='buttons'>
					<a class='button is-primary'>
						<strong>Sign up</strong>
					</a>
					<a class='button is-light'>
						Log in
					</a>
				</div>
			</b-navbar-item> -->
		</template>
	</b-navbar>
</template>


<script>
export default {
	name: 'Navbar',
	computed: {
		// eslint-disable-next-line vue/return-in-computed-property
		user() {
			this.$root.socket.emit('getUser', user => {
				return user;
			});
		}
	}
};
</script>

<style scoped>

</style>
