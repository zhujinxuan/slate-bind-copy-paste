// @flow

import getFragmentAtRange from './getFragmentAtRange/index';
import insertFragmentAtRange from './insertFragmentAtRange/index';
import deleteAtRange from './deleteAtRange/index';
import isTextBlock from './utils/isTextBlock';
import getFirstBlock from './utils/getFirstBlock';
import getLastBlock from './utils/getLastBlock';

export default {
    getFragmentAtRange: getFragmentAtRange.generate(),
    insertFragmentAtRange: insertFragmentAtRange.generate(),
    deleteAtRange: deleteAtRange.generate()
};
export {
    getFragmentAtRange,
    insertFragmentAtRange,
    deleteAtRange,
    isTextBlock,
    getFirstBlock,
    getLastBlock
};
