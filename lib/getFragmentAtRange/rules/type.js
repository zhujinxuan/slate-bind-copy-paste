// @flow
import { type Node, type Range, type Document } from 'slate';

export type typeRule = (
    (Node, Range) => Document,
    Node,
    Range,
    () => Document
) => Document;
