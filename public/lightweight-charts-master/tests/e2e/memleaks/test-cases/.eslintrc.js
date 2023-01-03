/* eslint-env node */

module.exports = {
	env: {
		browser: true,
		node: false,
	},
	rules: {
		'no-unused-vars': ['error', { varsIgnorePattern: '^runTestCase$', args: 'none' }],
	},
	globals: {
		LightweightCharts: false,
	},
};
