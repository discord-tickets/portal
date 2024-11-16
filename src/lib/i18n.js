export const importJSON = (...modules) => [
	modules[0].locale_id,
	[].concat(...modules.map((mod) => mod.json))
];

export const getSupportedLocales = () => {
	const files = Object.keys(import.meta.glob('$lib/locales/**'));
	return Array.from(
		new Set(
			files.map((file) => {
				const parts = file.split('/');
				return parts[parts.length - 2];
			})
		)
	);
};
