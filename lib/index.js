// @flow

import getFragmentAtRange from './getFragmentAtRange/index';
import insertFragmentAtRange from './insertFragmentAtRange/index';
import deleteAtRange from './deleteAtRange/index';

export default {
    getFragmentAtRange: getFragmentAtRange.generate(),
    insertFragmentAtRange: insertFragmentAtRange.generate(),
    deleteAtRange: deleteAtRange.generate()
};
export { getFragmentAtRange, insertFragmentAtRange, deleteAtRange };
