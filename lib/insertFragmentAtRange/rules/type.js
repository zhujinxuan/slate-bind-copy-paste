// @flow
import { List, Record } from 'immutable';
import { type Node, type Change, type Range, type Document, Text } from 'slate';

class InsertAtRangeOptions extends Record({
    lastNodeAsText: true,
    firstNodeAsText: true,
    startText: Text.create(''),
    endText: Text.create(''),
    startKey: '',
    endKey: '',
    startAncestors: List.of(),
    endAncestors: List.of()
}) {
    lastNodeAsText: boolean;
    firstNodeAsText: boolean;
    startText: Text;
    endText: Text;
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
