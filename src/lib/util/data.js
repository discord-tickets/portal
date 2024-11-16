export function flatten(object) {
	// specifically instance of Error, not API responses which may have other properties
	object = object instanceof Error ? { message: object.message } : object;
	const entries = [];
	for (let [k, v] of Object.entries(object)) {
		if (typeof v === 'string') {
			try {
				v = JSON.parse(v);
				if (typeof v === 'object') {
					v = flatten(v);
				}
			} catch {
				/* empty */
			}
		} else if (typeof v === 'object') {
			v = flatten(v);
		} else {
			v = v.toString();
		}
		entries.push([k, v]);
	}
	console.log(entries);
	return entries;
}
