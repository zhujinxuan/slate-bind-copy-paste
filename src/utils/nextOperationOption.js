// @flow
import { type Node, type Range } from 'slate';
import { type DeleteAtRangeOptions } from '../deleteAtRange/rules/type';
import { type InsertAtRangeOptions } from '../insertFragmentAtRange/rules/type';
import { type GetAtRangeOptions } from '../getFragmentAtRange/rules/type';

function nextOption<
    T: GetAtRangeOptions | InsertAtRangeOptions | DeleteAtRangeOptions
>(node: Node, range: Range, opt: T): T {
    const { startKey, endKey } = range;
    const { startAncestors, endAncestors } = opt;
    if (startAncestors.first() !== node || opt.startKey !== startKey) {
        const startText = node
            .getAncestors(startKey)
            .last()
            .getChild(startKey);
        opt = opt.merge({
            startAncestors: node.getAncestors(startKey),
            startKey,
            startText
        });
    }
    if (endAncestors.first() !== node || opt.endKey !== endKey) {
        const endText = node
            .getAncestors(endKey)
            .last()
            .getChild(endKey);
        opt = opt.merge({
            endAncestors: node.getAncestors(endKey),
            endKey,
            endText
        });
    }

    return opt;
}

export default nextOption;
