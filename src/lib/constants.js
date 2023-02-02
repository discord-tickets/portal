import { dev } from '$app/environment';
import { PUBLIC_HOST } from '$env/static/public';

export const getOrigin = url => dev ? PUBLIC_HOST : url.origin;