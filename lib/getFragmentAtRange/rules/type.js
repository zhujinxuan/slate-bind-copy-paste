// @flow
import { Record, List } from 'immutable';
import { type Node, type Range, type Document } from 'slate';

class GetAtRangeOptions extends Record({
    startPath: [],
    endPath: [],
    startAncestors: List.of(),
    endAncestors: List.of()
}) {
    startPath: Array<number>;
    endPath: Array<number>;
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
