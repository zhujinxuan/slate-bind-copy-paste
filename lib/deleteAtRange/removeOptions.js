// @flow
import { List, Record } from 'immutable';
import { type Node } from 'slate';

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

export { DeleteAtRangeOptions };
