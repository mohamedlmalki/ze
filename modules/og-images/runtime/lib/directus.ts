import { createDirectus, readItems, readItem, rest, staticToken } from '@directus/sdk';
import Queue from 'p-queue';

import type { Schema } from '~/types/schema';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const queue = new Queue({ concurrency: 10, interval: 1000 });

// Fetch the data from Directus
const directusUrl = process.env.DIRECTUS_URL as string;
const directusToken = process.env.DIRECTUS_TOKEN as string;

const directus = createDirectus<Schema>(directusUrl)
	.with(staticToken(directusToken))
	.with(
		rest({
			onRequest: async (request) => {
				await queue.add(() => sleep(500));
				return request;
			},
		})
	);

export { directus, readItems, readItem };