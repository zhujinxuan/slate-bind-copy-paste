import expect from 'expect';
import fs from 'fs';
import path from 'path';
import { Value } from 'slate';
import readMetadata from 'read-metadata';

import {
    insertFragmentAtRange as insertPlugin,
    deleteAtRange as deletePlugin,
    getFragmentAtRange as getPlugin
} from '../lib';

const plugin = {
    insertFragmentAtRange: insertPlugin.generate(),
    deleteAtRange: deletePlugin.generate(),
    getFragmentAtRange: getPlugin.generate()
};

function deserializeValue(json) {
    return Value.fromJSON({ ...json }, { normalize: false });
}

describe('slate-bind-copy-paste', () => {
    const tests = fs.readdirSync(__dirname);

    tests.forEach(test => {
        if (test[0] === '.' || path.extname(test).length > 0) return;

        it(test, () => {
            const dir = path.resolve(__dirname, test);
            const input = readMetadata.sync(path.resolve(dir, 'input.yaml'));
            const expectedPath = path.resolve(dir, 'expected.yaml');
            const expected =
                fs.existsSync(expectedPath) && readMetadata.sync(expectedPath);

            // eslint-disable-next-line
            const runChange = require(path.resolve(dir, 'change.js')).default;

            const valueInput = deserializeValue(input);

            const newChange = runChange(plugin, valueInput.change());

            if (expected) {
                const newDocJSon = newChange.value.toJSON();
                expect(newDocJSon).toEqual(deserializeValue(expected).toJSON());
            }
        });
    });
});
