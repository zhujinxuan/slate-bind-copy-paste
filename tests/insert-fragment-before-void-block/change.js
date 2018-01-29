import { Document, Range } from 'slate';

export default function(plugin, change) {
    const { insertFragmentAtRange } = plugin;
    const { document } = change.value;
    const fragment = Document.create({ nodes: document.nodes.first().nodes });
    const cursorBlock = document.getDescendant('_cursor_');
    const range = Range.create().collapseToStartOf(cursorBlock);
    return insertFragmentAtRange(change, range, fragment);
}
