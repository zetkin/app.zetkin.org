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

  it('returns an array with StringNodes and an ItalicNode when passed a html string with text and an <i> tag', () => {
    const nodes = htmlToInlineNodes(
      'This is our whole email. It is <i>very short.</i>'
    );

    expect(nodes.length).toEqual(2);
    expect(nodes[0]).toEqual({
      kind: InlineNodeKind.STRING,
      value: 'This is our whole email. It is ',
    });
    expect(nodes[1]).toEqual({
      content: [
        {
          kind: InlineNodeKind.STRING,
          value: 'very short.',
        },
      ],
      kind: InlineNodeKind.ITALIC,
    });
  });

  it('returns an array with StringNodes and a BoldNode when passed a html string with text and <b> tag', () => {
    const nodes = htmlToInlineNodes(
      'This is our <b>whole email</b>. It is very short.'
    );

    expect(nodes).toEqual([
      {
        kind: InlineNodeKind.STRING,
        value: 'This is our ',
      },
      {
        content: [
          {
            kind: InlineNodeKind.STRING,
            value: 'whole email',
          },
        ],
        kind: InlineNodeKind.BOLD,
      },
      {
        kind: InlineNodeKind.STRING,
        value: '. It is very short.',
      },
    ]);
  });

  it('returns an array with StringNodes and a LinkNode when passed a html string with text and an <a> tag.', () => {
    const nodes = htmlToInlineNodes(
      'This is our whole email. <a href="http://zetkin.org/">It</a> is very short.'
    );

    expect(nodes).toEqual([
      {
        kind: InlineNodeKind.STRING,
        value: 'This is our whole email. ',
      },
      {
        content: [
          {
            kind: InlineNodeKind.STRING,
            value: 'It',
          },
        ],
        href: 'http://zetkin.org/',
        kind: InlineNodeKind.LINK,
      },
      {
        kind: InlineNodeKind.STRING,
        value: ' is very short.',
      },
    ]);
  });

  it('returns an array with StringNodes and a VariableNode when passed a html string with text and a <span> tag that represents a variable', () => {
    const nodes = htmlToInlineNodes(
      'This is our whole email, <span contenteditable="false" style="background-color: rgba(0, 0, 0, 0.1); padding: 0.1em 0.5em; border-radius: 1em; display: inline-block;" data-slug="first_name">First name</span>. It is very short.'
    );

    expect(nodes).toEqual([
      {
        kind: InlineNodeKind.STRING,
        value: 'This is our whole email, ',
      },
      {
        kind: InlineNodeKind.VARIABLE,
        name: 'first_name',
      },
      {
        kind: InlineNodeKind.STRING,
        value: '. It is very short.',
      },
    ]);
  });
});
