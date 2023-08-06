import type { PageServerLoad } from './$types';
import {env} from "$env/dynamic/private";
import * as db from "$lib/server/db";

const CCTV_PATH = (env.CCTV_HOST ?? '') + (env.CCTV_PATH ?? '/cctv');

export const load = (async () => {
	return {
		videos: await db.get_videos(),
		cctv_path: CCTV_PATH,
	};
}) satisfies PageServerLoad;