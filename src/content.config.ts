import { defineCollection } from 'astro:content';
import { docsLoader, i18nLoader } from '@astrojs/starlight/loaders';
import { docsSchema, i18nSchema } from '@astrojs/starlight/schema';

export const collections = {
	docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),
	// Overrides a few of Starlight's built-in UI strings (src/content/i18n/en.json).
	i18n: defineCollection({ loader: i18nLoader(), schema: i18nSchema() }),
};
