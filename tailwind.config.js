import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	darkMode: 'class',

	theme: {
		extend: {
			colors: {
				blurple: '#5865F2',
				dgrey: {
					// brand "black" 23272A
					// very dark 1E1F22
					// darker 2B2D31
					// slightly dark 313338
					// not so dark 404249
					950: '#1E1F22',
					900: '#2B2D31',
					// 950: '#1E1F23',
					// 900: '#202225',
					800: '#2f3136',
					700: '#36393f',
					600: '#4f545c',
					400: '#d4d7dc',
					300: '#e3e5e8',
					200: '#ebedef',
					100: '#f2f3f5'
				}
			}
		}
	},

	variants: {},

	plugins: [typography, forms]
};
