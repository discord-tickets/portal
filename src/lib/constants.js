import { dev } from '$app/environment';
import { PUBLIC_HOST } from '$env/static/public';

export const ROOT = dev ? PUBLIC_HOST : '';
