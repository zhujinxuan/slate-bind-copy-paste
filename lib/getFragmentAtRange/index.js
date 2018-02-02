// @flow
import { type Node, Range, type Document } from 'slate';
import { GetAtRangeOptions, type typeRule } from './rules/type';
import nextOperationOption from '../utils/nextOperationOption';

function bindRules(
    rules: Array<typeRule>,
    index: number,
    node: Node,
    range: Range,
    opts: GetAtRangeOptions
): Document {
    if (index === rules.length) {
        return node.getFragmentAtRange(range);
    }
    const rule = rules[index];
    const next = (getOpts: GetAtRangeOptions) =>
        bindRules(rules, index + 1, node, range, getOpts);
    const rootGetFragment = (n: Node, r: Range, o: GetAtRangeOptions) =>
        bindRules(rules, 0, n, r, o);
    const nextOpts = nextOperationOption(node, range, opts);
    return rule(rootGetFragment, node, range, nextOpts, next);
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
        return bindRules(rules, 0, node, range, new GetAtRangeOptions());
    }
};
