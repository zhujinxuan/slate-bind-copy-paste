// @flow
import { type typeRule } from './type';

const deleteAtSameText: typeRule = (rootDelete, change, range, opts, next) => {
    const { deleteStartText, deleteEndText } = opts;
    const { startKey, startOffset, endKey, endOffset } = range;
    if (startKey !== endKey) {
        return next(opts);
    }

    const { startText } = opts;
    if (startOffset === endOffset) {
        // disable change for voidParent when the range is collapsed
        if (!deleteStartText || !deleteEndText) {
            return change;
        }
        if (startOffset !== 0 && startText.text.length !== 0) {
            return change;
        }
    }

    const ancestors = opts.startAncestors;
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
        change.removeTextByKey(startKey, startOffset, endOffset - startOffset, {
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
