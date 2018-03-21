// @flow
import { Record, List } from 'immutable';
import { type Node, type Range, type Document, Text } from 'slate';

class GetAtRangeOptions extends Record({
    startKey: '',
    endKey: '',
    startAncestors: List.of(),
    endAncestors: List.of(),
    startText: Text.create(''),
    endText: Text.create('')
}) {
    startText: Text;
    endText: Text;
    startAncestors: List<Node>;
    endAncestors: List<Node>;
    merge: Object => GetAtRangeOptions;
    set: (string, *) => GetAtRangeOptions;
}

export type typeRule = (
    (Node, Range, GetAtRangeOptions) => Document,
    Node,
    Range,
    GetAtRangeOptions,
    (GetAtRangeOptions) => Document
) => Document;

export { GetAtRangeOptions };
