import { defineConfig, passthroughImageService } from 'astro/config';
import starlight from '@astrojs/starlight';
import { unified } from '@astrojs/markdown-remark';
import tailwindcss from '@tailwindcss/vite';

import links from './src/markdown/links.ts';
import youtube from './src/markdown/youtube.ts';

const user = (await import('./src/starlight.config.mjs')).default;

const starlightConfig = { ...(user.starlight ?? {}) };
const components = { ...(starlightConfig.components ?? {}) };
// Head carries the Markdown alternate link (always) and OG meta (self-gated
// via ogEnabled inside the component), so register it regardless of OG setting.
if (!components.Head) {
	components.Head = './src/components/Head.astro';
}
// Override EditLink to add the "Download Markdown" link (always) and to strip
// the synthetic `src/content/docs/` prefix from the edit URL when the caller
// stores content at the repo root (STARLIGHT_EDIT_LINK_STRIP).
if (!components.EditLink) {
	components.EditLink = './src/components/EditLink.astro';
}
starlightConfig.components = components;

export default defineConfig({
	site: process.env.STARLIGHT_SITE || user.site,
	base: process.env.STARLIGHT_BASE || user.base,
	markdown: {
		processor: unified({
			remarkPlugins: [youtube, ...(user.markdown?.remarkPlugins ?? [])],
			rehypePlugins: [links(user.linksHostname), ...(user.markdown?.rehypePlugins ?? [])],
		}),
	},
	image: {
		service: passthroughImageService(),
	},
	integrations: [starlight(starlightConfig)],
	vite: {
		plugins: [tailwindcss()],
	},
});
