// @flow
import { type Change, Range } from 'slate';
import { type typeRule } from './rules/type';
import { type typeRemoveOptions } from './removeOptions';
import atDifferentText from './rules/atDifferentText';
import atSameText from './rules/atSameText';

function bindRules(
    rules: Array<typeRule>,
    index: number,
    change: Change,
    range: Range,
    opts: typeRemoveOptions
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
        removeOptions: typeRemoveOptions
    ) => bindRules(rules, 0, n, r, removeOptions);
    return rule(rootDeleteAtRange, change, range, opts, next);
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

        bindRules(rules, 0, change, range, {
            normalize: false,
            snapshot: false,
            deleteStartText,
            deleteEndText
        });

        if (normalize) {
            change.normalize();
        }
        return change;
    }
};
