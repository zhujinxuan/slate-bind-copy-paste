// @flow
import { type typeRule } from './type';

const deleteAtSameText: typeRule = (rootDelete, change, range, opts, next) => {
    const { deleteStartText, deleteEndText } = opts;
    if (range.isCollapsed) {
        return change;
    }
    const { startKey, startOffset, endKey, endOffset } = range;
    if (startKey !== endKey) {
        return next(opts);
    }

    if (startOffset === endOffset) {
        // disable change for voidParent when the range is collapsed
        return change;
    }

    const ancestors = opts.startAncestors;
    const voidParent = ancestors.findLast(n => n.isVoid);
    if (!voidParent && (!deleteStartText || !deleteEndText)) {
        change.removeTextByKey(startKey, startOffset, endOffset, {
            normalize: false
        });
        return change;
    }

    const startText = ancestors.last().getChild(startKey);
    if (!voidParent && startOffset !== 0) {
        change.removeTextByKey(startKey, startOffset, endOffset, {
            normalize: false
        });
        return change;
    }

    if (!voidParent && endOffset !== startText.text.length) {
        change.removeTextByKey(startKey, startOffset, endOffset, {
            normalize: false
        });
        return change;
    }

    const child = voidParent || startText;
    const ancestorsFromDeleteNode = voidParent
        ? ancestors.takeUntil(n => n === voidParent)
        : ancestors;
    const lonelyStart = ancestorsFromDeleteNode
        .reverse()
        .takeWhile(n => n.nodes.size === 1)
        .last();

    if (lonelyStart) {
        change.removeNodeByKey(lonelyStart.key, { normalize: false });
        return change;
    }

    change.removeNodeByKey(child.key, { normalize: false });
    return change;
};
export default deleteAtSameText;
