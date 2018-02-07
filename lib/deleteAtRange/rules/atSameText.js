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
    const { startText } = opts;
    const voidParent = ancestors.findLast(n => n.isVoid);

    if (!voidParent) {
        if (
            deleteStartText &&
            deleteEndText &&
            startOffset === 0 &&
            startText.text.length === endOffset
        ) {
            const lonelyParent = ancestors
                .reverse()
                .takeWhile(n => n.object !== 'document' && n.nodes.size === 1)
                .last();
            const removalKey = lonelyParent ? lonelyParent.key : startKey;
            change.removeNodeByKey(removalKey, { normalize: false });
            return change;
        }
        change.removeTextByKey(startKey, startOffset, endOffset, {
            normalize: false
        });
        return change;
    }

    if (voidParent.object !== 'block') {
        if (deleteStartText && deleteEndText) {
            change.removeNodeByKey(voidParent.key, { normalize: false });
            return change;
        }
        change.replaceNodeByKey(voidParent.key, startText, {
            normalize: false
        });
        return rootDelete(change, range.moveToRangeOf(startText), opts);
    }

    const voidAncestors = ancestors.takeWhile(n => n !== voidParent);
    const lonelyStart = voidAncestors
        .reverse()
        .takeWhile(n => n.object !== 'document' && n.nodes.size === 1)
        .last();

    if (lonelyStart) {
        change.removeNodeByKey(lonelyStart.key, { normalize: false });
        return change;
    }

    change.removeNodeByKey(voidParent.key, { normalize: false });
    return change;
};
export default deleteAtSameText;
