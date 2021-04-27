import Vue from 'vue';
import VueRouter from 'vue-router';
import ServerSelector from '../views/ServerSelector.vue';

Vue.use(VueRouter);

const routes = [
	{
		path: '/',
		name: 'ServerSelector',
		component: ServerSelector
	},
	{
		path: '/about',
		name: 'About',
		component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
	}
];

const router = new VueRouter({
	routes
});

export default router;
