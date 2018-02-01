// @flow
import { type Node } from 'slate';
import { type typeRule } from './type';

const atDifferentText: typeRule = (rootDelete, change, range, opts, next) => {
    const { deleteStartText } = opts;
    if (range.isCollapsed) {
        return change;
    }
    const { startKey, startOffset } = range;
    if (startKey === range.endKey) {
        return next(opts);
    }
    const { document } = change.value;
    const ancestors = opts.startAncestors;
    const startText = document.getDescendantAtPath(opts.startPath);

    const voidParent = ancestors.findLast(n => n.isVoid);

    const nextText = document.getNextText(startKey);
    if (!nextText) {
        return rootDelete(change, range.moveFocusToEndOf(startText), opts);
    }

    opts = opts.set('deleteStartText', true);
    if (voidParent) {
        change.removeNodeByKey(voidParent.key, { normalize: false });
        const nextBlock = document.getNextBlock(voidParent.key);
        if (!nextBlock) {
            return change;
        }
        return rootDelete(change, range.moveAnchorToStartOf(nextBlock), opts);
    }

    if (startOffset !== 0) {
        change.removeTextByKey(
            startKey,
            startOffset,
            startText.text.length - startOffset,
            { normalize: false }
        );
        return rootDelete(change, range.moveAnchorToStartOf(nextText), opts);
    }

    if (!deleteStartText) {
        change.removeTextByKey(startKey, 0, startText.text.length, {
            normalize: false
        });
        return rootDelete(change, range.moveAnchorToStartOf(nextText), opts);
    }

    const { endKey } = range;

    const endAncestorsFromDocument = document.getAncestors(endKey);
    const commonAncestor: Node = ancestors.findLast(
        (n, index) => n === endAncestorsFromDocument.get(index)
    );

    const startAncestors = ancestors
        .skipUntil(n => n === commonAncestor)
        .shift();
    const endAncestors = endAncestorsFromDocument
        .skipUntil(n => n === commonAncestor)
        .shift();
    const startChild = startAncestors.first();
    const endChild = endAncestors.first();

    if (startChild !== endChild) {
        const indexStart = commonAncestor.nodes.indexOf(startChild) + 1;
        const indexEnd = commonAncestor.nodes.indexOf(endChild);
        const middleNodes = commonAncestor.nodes.slice(indexStart, indexEnd);
        middleNodes.forEach(n => {
            change.removeNodeByKey(n.key, { normalize: false });
        });
    }

    startAncestors.forEach((n, index) => {
        const childKey =
            index + 1 < startAncestors.size
                ? startAncestors.get(index + 1).key
                : startKey;
        n.nodes.findLast(afterChild => {
            if (afterChild.key === childKey) {
                return true;
            }
            change.removeNodeByKey(afterChild.key, { normalize: false });
            return false;
        });
    });

    endAncestors.forEach((n, index) => {
        const childKey =
            index + 1 < endAncestors.size
                ? endAncestors.get(index + 1).key
                : endKey;
        n.nodes.find(beforeChild => {
            if (beforeChild.key === childKey) {
                return true;
            }
            change.removeNodeByKey(beforeChild.key, { normalize: false });
            return false;
        });
    });

    // Delete the lonely child
    const lonelyStart = startAncestors
        .reverse()
        .takeWhile((n, index) => {
            const child =
                index + 1 < startAncestors.size
                    ? startAncestors.get(index + 1)
                    : startText;
            return child === n.nodes.first();
        })
        .first();

    change.removeNodeByKey(lonelyStart ? lonelyStart.key : startKey, {
        normalize: false
    });

    return rootDelete(change, range.moveAnchorTo(endKey, 0), opts);
};

export default atDifferentText;
