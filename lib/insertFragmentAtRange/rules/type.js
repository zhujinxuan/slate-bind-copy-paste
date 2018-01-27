// @flow
import { type Change, type Range, type Document } from 'slate';
import { type typeInsertOptions } from '../insertOptions';

export type typeRule = (
    (Change, Range, Document, typeInsertOptions) => Change,
    Change,
    Range,
    Document,
    typeInsertOptions,
    (typeInsertOptions) => Change
) => Change;
