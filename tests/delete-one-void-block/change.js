import { Range } from 'slate';

export default function(plugin, change) {
    const { document } = change.value;
    const cursorNode = document.getDescendant('_cursor_');
    const range = Range.create()
        .moveAnchorToStartOf(cursorNode)
        .moveFocusToEndOf(cursorNode);
    const deleteAtRange = plugin.deleteAtRange.generate();
    return deleteAtRange(change, range);
}
