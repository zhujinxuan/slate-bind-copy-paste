// @flow
import { List } from 'immutable';
import { type Node, type Range, type Text } from 'slate';
import { type DeleteAtRangeOptions } from '../deleteAtRange/removeOptions';
import { type InsertAtRangeOptions } from '../insertFragmentAtRange/insertOptions';

function nextOption<T: InsertAtRangeOptions | DeleteAtRangeOptions>(
    node: Node,
    range: Range,
    opt: T
): T {
    const { startKey, endKey } = range;
    const tryStart = node.getDescendantAtPath(opt.startPath);
    const tryEnd = node.getDescendantAtPath(opt.endPath);

    const isSameStartPath = tryStart && tryStart.key === startKey;
    if (isSameStartPath) {
        if (opt.startAncestors.first() !== node.nodes.get(opt.startPath[0])) {
            const startAncestors = pathToAncestors(node, opt.startPath);
            opt = opt.merge({ startAncestors });
        }
    } else {
        const startAncestors = node.getAncestors(startKey);
        const startPath = ancestorsToPath(node, startAncestors, startKey);
        opt = opt.merge({ startAncestors, startPath });
    }

    const isSameEndPath = tryEnd && tryEnd.key === endKey;
    if (isSameEndPath) {
        if (opt.endAncestors.first() !== node.nodes.get(opt.endPath[0])) {
            const endAncestors = pathToAncestors(node, opt.endPath);
            opt = opt.merge({ endAncestors });
        }
    } else {
        const endAncestors = node.getAncestors(endKey);
        const endPath = ancestorsToPath(node, endAncestors, endKey);
        opt = opt.merge({ endAncestors, endPath });
    }
    return opt;
}

function ancestorsToPath(
    node: Node,
    ancestors: List<Node>,
    key: Text
): Array<number> {
    return ancestors
        .map((n, index) => {
            const nextIndex = index + 1;
            if (nextIndex < ancestors.size) {
                return n.nodes.indexOf(ancestors.get(nextIndex));
            }
            return n.nodes.findIndex(t => t.key === key);
        })
        .toArray();
}

function pathToAncestors(node: Node, path: Array<number>): List<Node> {
    const top = node;
    return List(path)
        .pop()
        .map(childIndex => {
            node = node.nodes.get(childIndex);
            return node;
        })
        .unshift(top);
}
export default nextOption;
