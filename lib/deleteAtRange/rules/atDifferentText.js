// @flow
import { type typeRule } from './type';

const atDifferentText: typeRule = (rootDelete, change, range, opts, next) => {
    if (range.isCollapsed) {
        return change;
    }

    const { startKey, endKey } = range;
    if (startKey === endKey) {
        return next(opts);
    }
    const { document } = change.value;

    const nextText = document.getNextText(startKey);

    if (!nextText) {
        return rootDelete(
            change,
            range.moveFocusToEndOf(document.getDescendant(startKey)),
            opts
        );
    }

    if (nextText.key !== endKey) {
        const commonAncestor = document.getCommonAncestor(startKey, endKey);

        const startAncestors = commonAncestor.getAncestors(startKey).shift();
        const endAncestors = commonAncestor.getAncestors(endKey).shift();
        const startChild = startAncestors.first();
        const endChild = endAncestors.first();

        const indexStart = commonAncestor.nodes.indexOf(startChild) + 1;
        const indexEnd = commonAncestor.nodes.indexOf(endChild);
        const middleNodes = commonAncestor.nodes.slice(indexStart, indexEnd);
        middleNodes.forEach(n => {
            change.removeNodeByKey(n.key, { normalize: false });
        });

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
        return rootDelete(change, range, opts);
    }

    const { deleteStartText, deleteEndText } = opts;
    const commonAncestor = document.getCommonAncestor(startKey, endKey);

    if (commonAncestor.isVoid) {
        change.removeNodeByKey(commonAncestor.key);
        return change;
    }

    if (deleteStartText && deleteEndText) {
        if (
            range.collapseToStart().isAtStartOf(commonAncestor) &&
            range.collapseToEnd().isAtEndOf(commonAncestor)
        ) {
            if (commonAncestor.object !== 'document') {
                change.removeNodeByKey(commonAncestor.key, {
                    normalize: false
                });
                return change;
            }
            return rootDelete(
                change,
                range,
                opts.set('deleteStartText', false)
            );
        }
    }

    const startBlock = document.getClosestBlock(startKey);
    const endBlock = document.getClosestBlock(endKey);
    const { startText, endText } = opts;

    if (!deleteStartText && startBlock !== endBlock) {
        if (range.collapseToStart().isAtStartOf(startBlock)) {
            if (range.collapseToEnd().isAtStartOf(endBlock)) {
                return rootDelete(
                    change,
                    range.moveFocusToEndOf(startText),
                    opts
                );
            }
            if (endBlock.isVoid) {
                change.removeNodeByKey(endBlock.key, { normalize: false });
                return rootDelete(
                    change,
                    range.moveFocusToEndOf(startText),
                    opts
                );
            }
            change.removeNodeByKey(startBlock.key, { normalize: false });
            change.insertNodeByKey(endBlock.key, 0, startText, {
                normalize: false
            });
            return rootDelete(change, range, opts);
        }
    }
    if (startBlock === endBlock) {
        if (startBlock.isVoid) {
            change.removeNodeByKey(startBlock.key, { normalize: false });
        }
    }
    rootDelete(
        change,
        range.moveFocusToEndOf(startText),
        opts.set('deleteEndText', true)
    );
    return rootDelete(
        change,
        range.moveAnchorToStartOf(endText),
        opts.set('deleteStartText', true)
    );
};

export default atDifferentText;
