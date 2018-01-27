// @flow
import { type Change, type Range } from 'slate';
import { type typeRemoveOptions } from '../removeOptions';

export type typeRule = (
    (Change, Range, typeRemoveOptions) => Change,
    Change,
    Range,
    typeRemoveOptions,
    (typeRemoveOptions) => Change
) => Change;
