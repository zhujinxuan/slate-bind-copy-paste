// @flow
import { type Node, Range, type Document } from 'slate';
import { type typeRule } from './rules/type';

function bindRules(
    rules: Array<typeRule>,
    index: number,
    node: Node,
    range: Range
): Document {
    if (index === rules.length) {
        return node.getFragmentAtRange(range);
    }
    const rule = rules[index];
    const next = () => bindRules(rules, index + 1, node, range);
    const rootGetFragment = (n: Node, r: Range) => bindRules(rules, 0, n, r);
    return rule(rootGetFragment, node, range, next);
}

export default {
    generate: (rules: Array<typeRule> = []) => (
        node: Node,
        range: Range
    ): Document => {
        if (range.isBackward) {
            const { startKey, startOffset, endKey, endOffset } = range;
            range = Range.create()
                .moveAnchorTo(startKey, startOffset)
                .moveFocusTo(endKey, endOffset);
        }
        return bindRules(rules, 0, node, range);
    }
};
