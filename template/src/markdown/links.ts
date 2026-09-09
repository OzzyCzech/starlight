import { defineHastPlugin } from 'satteri';

// rehype-external-links is a unified plugin and can't run in the Sätteri
// pipeline, so the behaviour it was configured for is inlined here: mark
// http(s) links that point off-site with target/rel. The protocol check
// mirrors rehype-external-links' `protocols: ['http', 'https']` default, which
// kept mailto:/tel: links untouched.
export default function links(hostname?: string) {
	return defineHastPlugin({
		name: 'external-links',
		element: {
			filter: ['a'],
			visit(node, ctx) {
				const href = node.properties?.href;
				if (typeof href !== 'string' || !URL.canParse(href)) return;

				const url = new URL(href);
				if (url.protocol !== 'http:' && url.protocol !== 'https:') return;
				if (hostname && url.hostname === hostname) return;

				ctx.setProperty(node, 'target', '_blank');
				ctx.setProperty(node, 'rel', ['noopener', 'noreferrer']);
			},
		},
	});
}
