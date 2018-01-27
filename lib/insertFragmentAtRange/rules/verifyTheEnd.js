// @flow
import { type typeRule } from './type';

const insertNodesAsBlocks: typeRule = (
    rootInsert,
    change,
    range,
    fragment,
    opts,
    next
) => {
    if (range.isExpannded && !change.value.document(range.endKey)) {
        return rootInsert(change, range.collapseToStart(), fragment, opts);
    }
    return next(opts);
};
export default insertNodesAsBlocks;
