module.exports = {
	root: true,
	extends: ['eslint:recommended', 'plugin:svelte/recommended', 'prettier'],
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2020,
		extraFileExtensions: ['.svelte'],
		tsconfigRootDir: __dirname
	},
	env: {
		browser: true,
		es2017: true,
		node: true
	}
};
