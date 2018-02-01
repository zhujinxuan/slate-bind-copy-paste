// @flow
import { type Change, type Range, type Document } from 'slate';
import { type InsertAtRangeOptions } from '../insertOptions';

export type typeRule = (
    (Change, Range, Document, InsertAtRangeOptions) => Change,
    Change,
    Range,
    Document,
    InsertAtRangeOptions,
    (InsertAtRangeOptions) => Change
) => Change;
