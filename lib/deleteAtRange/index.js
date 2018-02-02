// @flow
import { type Change, Range } from 'slate';
import { DeleteAtRangeOptions, type typeRule } from './rules/type';
import atDifferentText from './rules/atDifferentText';
import atSameText from './rules/atSameText';
import nextOperationOption from '../utils/nextOperationOption';

function bindRules(
    rules: Array<typeRule>,
    index: number,
    change: Change,
    range: Range,
    opts: DeleteAtRangeOptions
): Change {
    if (index === rules.length) {
        return change;
    }
    const rule = rules[index];
    const next = removeOptions =>
        bindRules(rules, index + 1, change, range, removeOptions);
    const rootDeleteAtRange = (
        n: Change,
        r: Range,
        removeOptions: DeleteAtRangeOptions
    ) => bindRules(rules, 0, n, r, removeOptions);
    const nextOption = nextOperationOption(change.value.document, range, opts);
    return rule(rootDeleteAtRange, change, range, nextOption, next);
}

const defaultRules: Array<typeRule> = [atDifferentText, atSameText];

export default {
    rules: { atDifferentText, atSameText },
    generate: (rules: Array<typeRule> = defaultRules) => (
        change: Change,
        range: Range,
        opts: Object = {}
    ): Change => {
        const {
            normalize = true,
            deleteStartText = false,
            snapshot = true,
            deleteEndText = true
        } = opts;

        if (snapshot) {
            change.snapshotSelection();
        }
        if (range.isBackward) {
            const { startKey, startOffset, endKey, endOffset } = range;
            range = Range.create()
                .moveAnchorTo(startKey, startOffset)
                .moveFocusTo(endKey, endOffset);
        }

        bindRules(
            rules,
            0,
            change,
            range,
            new DeleteAtRangeOptions({ deleteStartText, deleteEndText })
        );

        if (normalize) {
            change.normalize();
        }
        return change;
    }
};
