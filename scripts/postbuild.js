// SvelteKit is broken:
// https://github.com/sveltejs/kit/issues/3726#issuecomment-1179129639

import fs from 'fs';
import { join } from 'path';
import CONFIG from '../svelte.config.js';

const base = CONFIG.kit.paths.base;
const src = './build/client/';
const dest = join(src, base);
const files = fs.readdirSync(src);
fs.mkdirSync(dest);
files.forEach((f) => {
	console.log('Moving', f);
	fs.renameSync(join(src, f), join(dest, f));
});
