// @flow
import { type typeRule } from './type';

const deleteAtSameText: typeRule = (rootDelete, change, range, opts, next) => {
    const { deleteStartText } = opts;
    if (range.isCollapsed) {
        return change;
    }
    const { startKey, startOffset, endKey, endOffset } = range;
    if (startKey !== endKey) {
        return next(opts);
    }

    if (startOffset !== 0) {
        change.removeTextByKey(startKey, startOffset, endOffset, {
            normalize: false
        });
        return change;
    }

    const { document } = change.value;

    const ancestors = document.getAncestors(startKey);
    const voidParent = ancestors.findLast(n => n.isVoid);
    if (!voidParent && !deleteStartText) {
        change.removeTextByKey(startKey, startOffset, endOffset, {
            normalize: false
        });
        return change;
    }

    const startText = ancestors.last().getChild(startKey);
    if (endOffset !== startText.text.length) {
        change.removeTextByKey(startKey, startOffset, endOffset, {
            normalize: false
        });
        return change;
    }

    const lonelyStart = ancestors
        .reverse()
        .takeWhile((n, index) => n.nodes.size === 1)
        .last();

    if (lonelyStart) {
        change.removeNodeByKey(lonelyStart.key, { normalize: false });
        return change;
    }

    change.removeNodeByKey(startKey, { normalize: false });
    return change;
};
export default deleteAtSameText;
