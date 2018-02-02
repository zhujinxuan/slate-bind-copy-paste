// @flow
import { type Change, Range, type Document } from 'slate';
import { InsertAtRangeOptions, type typeRule } from './rules/type';
import firstParagraphAsText from './rules/firstParagraphAsText';
import lastParagraphAsText from './rules/lastParagraphAsText';
import nodesAsBlocks from './rules/nodesAsBlocks';
import nextOperationOption from '../utils/nextOperationOption';

function bindRules(
    rules: Array<typeRule>,
    index: number,
    change: Change,
    range: Range,
    fragment: Document,
    opts: InsertAtRangeOptions
): Change {
    if (index === rules.length) {
        return change.insertFragmentAtRange(range, fragment, opts);
    }
    const rule = rules[index];
    const next = (insOpt: InsertAtRangeOptions) =>
        bindRules(rules, index + 1, change, range, fragment, insOpt);
    const rootInsert = (
        c: Change,
        r: Range,
        f: Document,
        insOpt: InsertAtRangeOptions
    ) => bindRules(rules, 0, c, r, f, insOpt);
    const nextOption = nextOperationOption(change.value.document, range, opts);
    return rule(rootInsert, change, range, fragment, nextOption, next);
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
            snapshot = true
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
                deleteStartText: false,
                deleteEndText: false,
                snapshot
            });
            if (range.endKey === range.startKey) {
                range = range.collapseToStart();
            } else {
                range = range.moveFocusTo(range.endKey, 0);
                if (!change.value.document.getDescendant(range.endKey)) {
                    range = range.collapseToStart();
                }
            }
        } else if (snapshot) {
            change.snapshotSelection();
        }

        fragment = fragment.mapDescendants(child => child.regenerateKey());
        bindRules(
            rules,
            0,
            change,
            range,
            fragment,
            new InsertAtRangeOptions({
                lastNodeAsText,
                firstNodeAsText
            })
        );
        if (change.value.selection.isExpannded) {
            const { selection } = change.value;
            change.select(selection.collapseToStart(), { snapshot: false });
        }
        if (normalize) {
            change.normalize();
        }
        return change;
    }
};
