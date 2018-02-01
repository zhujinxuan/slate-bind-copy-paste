// @flow
import { List, Record } from 'immutable';
import { type Node } from 'slate';

export type typeInsertOptions = {
    lastNodeAsText: boolean,
    firstNodeAsText: boolean,
    snapshot: boolean,
    normalize: boolean
};

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

export { InsertAtRangeOptions };
