// @flow

import { type Change, Range, type Document } from 'slate';
import { type typeInsertOptions } from './insertOptions';
import { type typeRule } from './rules/type';
import verifyTheEnd from './rules/verifyTheEnd';
import firstParagraphAsText from './rules/firstParagraphAsText';
import lastParagraphAsText from './rules/lastParagraphAsText';
import nodesAsBlocks from './rules/nodesAsBlocks';

function bindRules(
    rules: Array<typeRule>,
    index: number,
    change: Change,
    range: Range,
    fragment: Document,
    insertOptions: typeInsertOptions
): Change {
    if (index === rules.length) {
        return change.insertFragmentAtRange(range, fragment, insertOptions);
    }
    const rule = rules[index];
    const next = (insOpt: typeInsertOptions) =>
        bindRules(rules, index + 1, change, range, fragment, insOpt);
    const rootInsert = (
        c: Change,
        r: Range,
        f: Document,
        insOpt: typeInsertOptions
    ) => bindRules(rules, 0, c, r, f, insOpt);
    return rule(rootInsert, change, range, fragment, insertOptions, next);
}

const defaultRules: Array<typeRule> = [
    firstParagraphAsText,
    lastParagraphAsText,
    nodesAsBlocks
];

type typeGenerateOptions = {
    deleteAtRange?: (Change, Range, Object) => *
};
export default {
    rules: {
        verifyTheEnd,
        firstParagraphAsText,
        lastParagraphAsText,
        nodesAsBlocks
    },
    generate: (
        rules: Array<typeRule> = defaultRules,
        generateOptions: typeGenerateOptions = {}
    ) => (
        change: Change,
        range: Range,
        fragment: Document,
        opts: Object = {}
    ): Change => {
        const {
            normalize = true,
            lastNodeAsText = true,
            firstNodeAsText = true,
            snapshotSelection = true
        } = opts;
        const {
            deleteAtRange = (c, r, o) => c.deleteAtRange(r, o)
        } = generateOptions;
        if (range.isBackward) {
            const { startKey, startOffset, endKey, endOffset } = range;
            range = Range.create()
                .moveAnchorTo(startKey, startOffset)
                .moveFocusTo(endKey, endOffset);
        }
        if (range.isExpannded) {
            deleteAtRange(change, range, {
                normalize: false,
                snapshotSelection
            });
            range = range.moveFocusTo(range.endKey, 0);
            if (!change.value.document.getDescendant(range.endKey)) {
                range = range.collapseToStart();
            }
        } else if (snapshotSelection) {
            change.snapshotSelection();
        }
        fragment = fragment.mapDescendants(child => child.regenerateKey());
        bindRules(rules, 0, change, range, fragment, {
            normalize,
            lastNodeAsText,
            firstNodeAsText,
            snapshotSelection: false
        });
        if (normalize) {
            change.normalize();
        }
        return change;
    }
};
