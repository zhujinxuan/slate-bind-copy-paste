// @flow
import { List, Record } from 'immutable';
import { type Node, type Change, type Range, Text } from 'slate';

class DeleteAtRangeOptions extends Record({
    deleteStartText: false,
    deleteEndText: true,
    startKey: '',
    endKey: '',
    startText: Text.create(''),
    endText: Text.create(''),
    startAncestors: List.of(),
    endAncestors: List.of()
}) {
    deleteStartText: boolean;
    deleteEndText: boolean;
    startAncestors: List<Node>;
    endAncestors: List<Node>;
    startKey: string;
    endKey: string;
    startText: Text;
    endText: Text;
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
