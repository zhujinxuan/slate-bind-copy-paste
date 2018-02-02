// @flow
import { List, Record } from 'immutable';
import { type Node, type Change, type Range, type Document } from 'slate';

class InsertAtRangeOptions extends Record({
    lastNodeAsText: true,
    firstNodeAsText: true,
    startPath: [],
    endPath: [],
    startAncestors: List.of(),
    endAncestors: List.of()
}) {
    lastNodeAsText: boolean;
    firstNodeAsText: boolean;
    startPath: Array<number>;
    endPath: Array<number>;
    startAncestors: List<Node>;
    endAncestors: List<Node>;
    merge: Object => InsertAtRangeOptions;
    set: (string, *) => InsertAtRangeOptions;
}

export type typeRule = (
    (Change, Range, Document, InsertAtRangeOptions) => Change,
    Change,
    Range,
    Document,
    InsertAtRangeOptions,
    (InsertAtRangeOptions) => Change
) => Change;

export { InsertAtRangeOptions };
