import { Range } from 'slate';

export default function(plugin, change) {
    const { document } = change.value;
    const anchorNode = document.getDescendant('_anchor_');
    const focusNode = document.getDescendant('_focus_');
    const range = Range.create()
        .moveAnchorToStartOf(anchorNode)
        .moveAnchor(1)
        .moveFocusToEndOf(focusNode)
        .moveFocus(-1);
    const { deleteAtRange } = plugin;
    return deleteAtRange(change, range);
}
