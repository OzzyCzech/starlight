import { defineMdastPlugin } from 'satteri';

// Sätteri nodes are read-only views over the Rust arena, so the link can't be
// retyped in place the way the remark version did — return the replacement
// instead. `rawHtml` is re-parsed by Rust into an inline html node, which is
// what the old `node.type = 'html'` mutation produced.
export default defineMdastPlugin({
	name: 'youtube',
	link(node) {
		if (!URL.canParse(node.url)) return;
		const video = new URL(node.url);

		let id: string | null = null;
		if (video.hostname.endsWith('youtube.com')) {
			id = video.searchParams.get('v');
		} else if (video.hostname.endsWith('youtu.be')) {
			id = video.pathname.slice(1) || null;
		}

		if (!id) return;

		return {
			rawHtml: `<iframe src="https://www.youtube.com/embed/${id}?rel=0&controls=1" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="aspect-ratio: 16 / 9; width: 100%; border: 0"></iframe>`,
		};
	},
});
