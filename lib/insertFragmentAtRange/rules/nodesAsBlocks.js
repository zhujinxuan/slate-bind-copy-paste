// @flow
// We can use default insertFragmentAtRange after PR 1553
// Waiting for merging

import { type typeRule } from './type';

const insertNodesAsBlocks: typeRule = (
    rootInsert,
    change,
    range,
    fragment,
    opts,
    next
) => {
    range = range.collapseToStart();
    const splitBlock = change.value.document.getClosestBlock(range.startKey);
    const parentPath = change.value.document.getPath(splitBlock.key);
    parentPath.pop();

    if (!range.isAtStartOf(splitBlock)) {
        change.splitDescendantsByKey(
            splitBlock.key,
            range.startKey,
            range.startOffset,
            { normalize: false }
        );
        const parent = change.value.document.getDescendantAtPath(parentPath);
        const startText = parent.getNextText(range.startKey);
        range = range.collapseToStartOf(startText);
    }

    const parent = change.value.document.getDescendantAtPath(parentPath);
    const startBlock = parent.getFurthestAncestor(range.startKey);
    const insertIndex = parent.nodes.indexOf(startBlock);
    fragment.nodes.forEach((block, index) =>
        change.insertNodeByKey(parent.key, insertIndex + index, block, {
            normalize: false
        })
    );
    return change;
};

export default insertNodesAsBlocks;
