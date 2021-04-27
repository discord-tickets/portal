module.exports = {
  root: true,
  env: {
	node: true
  },
  'extends': [
	'plugin:vue/essential',
	'eslint:recommended',
	// '@vue/prettier'
  ],
  parserOptions: {
	parser: 'babel-eslint'
  },
  rules: {
	'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
	'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
  'indent': [
      'warn',
      'tab'
    ],
    'quotes': [
      'warn',
      'single'
    ],
    'semi': [
      'error',
      'always'
    ],
  }
}
