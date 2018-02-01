// @flow
import { type Change, type Range } from 'slate';
import { type DeleteAtRangeOptions } from '../removeOptions';

export type typeRule = (
    (Change, Range, DeleteAtRangeOptions) => Change,
    Change,
    Range,
    DeleteAtRangeOptions,
    (DeleteAtRangeOptions) => Change
) => Change;
