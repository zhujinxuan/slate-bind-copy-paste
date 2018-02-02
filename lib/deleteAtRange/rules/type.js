// @flow
import { List, Record } from 'immutable';
import { type Node, type Change, type Range } from 'slate';

class DeleteAtRangeOptions extends Record({
    deleteStartText: false,
    deleteEndText: true,
    startPath: [],
    endPath: [],
    startAncestors: List.of(),
    endAncestors: List.of()
}) {
    deleteStartText: boolean;
    deleteEndText: boolean;
    startPath: Array<number>;
    endPath: Array<number>;
    startAncestors: List<Node>;
    endAncestors: List<Node>;
    merge: Object => DeleteAtRangeOptions;
    set: (string, *) => DeleteAtRangeOptions;
}

export type typeRule = (
    (Change, Range, DeleteAtRangeOptions) => Change,
    Change,
    Range,
    DeleteAtRangeOptions,
    (DeleteAtRangeOptions) => Change
) => Change;

export { DeleteAtRangeOptions };
