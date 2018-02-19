/** @jsx h */
/* eslint-disable react/void-dom-elements-no-children */
import h from '../h';

const fragment = (
    <document>
        <table>
            <tr>
                <td>Before</td>
                <td>Before Two</td>
            </tr>
        </table>
    </document>
);
export function runChange(plugin, change) {
    const { insertFragmentAtRange } = plugin;
    return insertFragmentAtRange(change, change.value.selection, fragment);
}

export const input = (
    <value>
        <document>
            <image />
            <image>
                <cursor />{' '}
            </image>
            <paragraph>
                <focus />word
            </paragraph>
        </document>
    </value>
);

export const output = (
    <value>
        <document>
            <image />
            <table>
                <tr>
                    <td>Before</td>
                    <td>Before Two</td>
                </tr>
            </table>
            <paragraph>
                <cursor />word
            </paragraph>
        </document>
    </value>
);
