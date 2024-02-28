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

  it('returns an array with StringNodes and LineBreakNodes when passed a html string with <br> tags in it', () => {
    const nodes = htmlToInlineNodes(
      'This is our whole email.<br>It is very short.'
    );

    expect(nodes.length).toEqual(3);
    expect(nodes[0]).toEqual({
      kind: InlineNodeKind.STRING,
      value: 'This is our whole email.',
    });
    expect(nodes[1]).toEqual({
      kind: InlineNodeKind.LINE_BREAK,
    });
    expect(nodes[2]).toEqual({
      kind: InlineNodeKind.STRING,
      value: 'It is very short.',
    });
  });
});
