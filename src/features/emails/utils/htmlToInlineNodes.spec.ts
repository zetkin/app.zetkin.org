/** @jest-environment jsdom */
import htmlToInlineNodes from './htmlToInlineNodes';
import { InlineNodeKind } from '../types';

describe('htmlToZetkinFormat()', () => {
  it('returns an array with a single StringNode when passed a html string with only plain text', () => {
    const nodes = htmlToInlineNodes(
      'This is our whole email. It is very short.'
    );

    expect(nodes.length).toEqual(1);
    expect(nodes[0]).toEqual({
      kind: InlineNodeKind.STRING,
      value: 'This is our whole email. It is very short.',
    });
  });
});
