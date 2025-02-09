import { InlineNodeKind } from 'features/emails/types';
import inlineNodesToRemirror from './inlineNodesToRemirror';
import { EmailVariable, MarkType, TextBlockContentType } from '../types';

describe('inlineNodesToRemirror()', () => {
  it('does nothing when passed an empty array', () => {
    const remirrorTextContent = inlineNodesToRemirror([]);

    expect(remirrorTextContent).toHaveLength(0);
  });

  it('converts String nodes', () => {
    const remirrorTextContent = inlineNodesToRemirror([
      {
        kind: InlineNodeKind.STRING,
        value: 'This is our whole email. It is very short.',
      },
    ]);

    expect(remirrorTextContent).toHaveLength(1);
    expect(remirrorTextContent).toEqual([
      {
        text: 'This is our whole email. It is very short.',
        type: TextBlockContentType.TEXT,
      },
    ]);
  });

  it('converts line break nodes', () => {
    const remirrorTextContent = inlineNodesToRemirror([
      {
        kind: InlineNodeKind.STRING,
        value: 'This is our whole email.',
      },
      {
        kind: InlineNodeKind.LINE_BREAK,
      },
      {
        kind: InlineNodeKind.STRING,
        value: 'It is very short.',
      },
    ]);

    expect(remirrorTextContent).toEqual([
      {
        text: 'This is our whole email.',
        type: TextBlockContentType.TEXT,
      },
      {
        type: TextBlockContentType.LINE_BREAK,
      },
      {
        text: 'It is very short.',
        type: TextBlockContentType.TEXT,
      },
    ]);
  });

  it('converts italics node', () => {
    const remirrorTextContent = inlineNodesToRemirror([
      {
        kind: InlineNodeKind.STRING,
        value: 'This is our whole email. It is ',
      },
      {
        content: [
          {
            kind: InlineNodeKind.STRING,
            value: 'very',
          },
        ],
        kind: InlineNodeKind.ITALIC,
      },
      {
        kind: InlineNodeKind.STRING,
        value: ' short.',
      },
    ]);

    expect(remirrorTextContent).toEqual([
      {
        text: 'This is our whole email. It is ',
        type: TextBlockContentType.TEXT,
      },
      {
        marks: [{ type: MarkType.ITALIC }],
        text: 'very',
        type: TextBlockContentType.TEXT,
      },
      {
        text: ' short.',
        type: TextBlockContentType.TEXT,
      },
    ]);
  });

  it('converts bold node', () => {
    const remirrorTextContent = inlineNodesToRemirror([
      {
        kind: InlineNodeKind.STRING,
        value: 'This is our whole email. It is ',
      },
      {
        content: [
          {
            kind: InlineNodeKind.STRING,
            value: 'very',
          },
        ],
        kind: InlineNodeKind.BOLD,
      },
      {
        kind: InlineNodeKind.STRING,
        value: ' short.',
      },
    ]);

    expect(remirrorTextContent).toEqual([
      {
        text: 'This is our whole email. It is ',
        type: TextBlockContentType.TEXT,
      },
      {
        marks: [{ type: MarkType.BOLD }],
        text: 'very',
        type: TextBlockContentType.TEXT,
      },
      {
        text: ' short.',
        type: TextBlockContentType.TEXT,
      },
    ]);
  });

  it('converts link nodes', () => {
    const remirrorTextContent = inlineNodesToRemirror([
      {
        kind: InlineNodeKind.STRING,
        value: 'This is our whole email. It is ',
      },
      {
        content: [{ kind: InlineNodeKind.STRING, value: 'very' }],
        href: 'http://www.zetkin.org',
        kind: InlineNodeKind.LINK,
        tag: 'abc123fh',
      },
      {
        kind: InlineNodeKind.STRING,
        value: ' short.',
      },
    ]);

    expect(remirrorTextContent).toEqual([
      {
        text: 'This is our whole email. It is ',
        type: TextBlockContentType.TEXT,
      },
      {
        marks: [
          { attrs: { href: 'http://www.zetkin.org' }, type: MarkType.LINK },
        ],
        text: 'very',
        type: TextBlockContentType.TEXT,
      },
      {
        text: ' short.',
        type: TextBlockContentType.TEXT,
      },
    ]);
  });

  it('converts content with both bold and italic nodes', () => {
    const remirrorTextContent = inlineNodesToRemirror([
      {
        kind: InlineNodeKind.STRING,
        value: 'This is our whole email. It is ',
      },
      {
        content: [
          {
            content: [
              {
                kind: InlineNodeKind.STRING,
                value: 'very',
              },
            ],
            kind: InlineNodeKind.BOLD,
          },
        ],
        kind: InlineNodeKind.ITALIC,
      },
      {
        kind: InlineNodeKind.STRING,
        value: ' short.',
      },
    ]);

    expect(remirrorTextContent).toEqual([
      {
        text: 'This is our whole email. It is ',
        type: TextBlockContentType.TEXT,
      },
      {
        marks: [{ type: MarkType.ITALIC }, { type: MarkType.BOLD }],
        text: 'very',
        type: TextBlockContentType.TEXT,
      },
      {
        text: ' short.',
        type: TextBlockContentType.TEXT,
      },
    ]);
  });

  it('converts content with a variable in it', () => {
    const remirrorTextContent = inlineNodesToRemirror([
      {
        kind: InlineNodeKind.STRING,
        value: 'This is our whole email, ',
      },
      {
        kind: InlineNodeKind.VARIABLE,
        name: EmailVariable.FIRST_NAME,
      },
      {
        kind: InlineNodeKind.STRING,
        value: '. It is very short.',
      },
    ]);

    expect(remirrorTextContent).toEqual([
      {
        text: 'This is our whole email, ',
        type: TextBlockContentType.TEXT,
      },
      {
        attrs: { name: 'first_name' },
        type: TextBlockContentType.VARIABLE,
      },
      {
        text: '. It is very short.',
        type: TextBlockContentType.TEXT,
      },
    ]);
  });

  it('converts complex intersections of different marks and content types', () => {
    const remirrorTextContent = inlineNodesToRemirror([
      { kind: InlineNodeKind.STRING, value: 'Th' },
      {
        content: [{ kind: InlineNodeKind.STRING, value: 'is i' }],
        kind: InlineNodeKind.ITALIC,
      },
      {
        kind: InlineNodeKind.STRING,
        value: 's ',
      },
      {
        content: [{ kind: InlineNodeKind.STRING, value: 'our who' }],
        kind: InlineNodeKind.BOLD,
      },
      {
        content: [
          {
            content: [{ kind: InlineNodeKind.STRING, value: 'le em' }],
            kind: InlineNodeKind.BOLD,
          },
        ],
        kind: InlineNodeKind.ITALIC,
      },
      {
        content: [
          {
            kind: InlineNodeKind.STRING,
            value: 'ai',
          },
        ],
        kind: InlineNodeKind.BOLD,
      },
      {
        kind: InlineNodeKind.STRING,
        value: 'l, ',
      },
      {
        kind: InlineNodeKind.VARIABLE,
        name: EmailVariable.FULL_NAME,
      },
      {
        kind: InlineNodeKind.STRING,
        value: '. It ',
      },
      {
        content: [
          {
            kind: InlineNodeKind.STRING,
            value: 'is ',
          },
        ],
        href: 'http://clara.org/',
        kind: InlineNodeKind.LINK,
        tag: '123abc12',
      },
      {
        kind: InlineNodeKind.STRING,
        value: 've',
      },
      {
        content: [
          {
            content: [{ kind: InlineNodeKind.STRING, value: 'ry ' }],
            kind: InlineNodeKind.BOLD,
          },
        ],
        kind: InlineNodeKind.ITALIC,
      },
      {
        content: [
          {
            content: [
              {
                content: [
                  {
                    kind: InlineNodeKind.STRING,
                    value: 'short',
                  },
                ],
                kind: InlineNodeKind.BOLD,
              },
            ],
            kind: InlineNodeKind.ITALIC,
          },
        ],
        href: 'http://zetkin.org/',
        kind: InlineNodeKind.LINK,
        tag: '123efg45',
      },
      {
        content: [
          {
            content: [
              {
                kind: InlineNodeKind.STRING,
                value: '.',
              },
            ],
            kind: InlineNodeKind.BOLD,
          },
        ],
        kind: InlineNodeKind.ITALIC,
      },
    ]);

    expect(remirrorTextContent).toEqual([
      {
        text: 'Th',
        type: TextBlockContentType.TEXT,
      },
      {
        marks: [
          {
            type: MarkType.ITALIC,
          },
        ],
        text: 'is i',
        type: TextBlockContentType.TEXT,
      },
      {
        text: 's ',
        type: TextBlockContentType.TEXT,
      },
      {
        marks: [
          {
            type: MarkType.BOLD,
          },
        ],
        text: 'our who',
        type: TextBlockContentType.TEXT,
      },
      {
        marks: [
          {
            type: MarkType.ITALIC,
          },
          {
            type: MarkType.BOLD,
          },
        ],
        text: 'le em',
        type: TextBlockContentType.TEXT,
      },
      {
        marks: [
          {
            type: MarkType.BOLD,
          },
        ],
        text: 'ai',
        type: TextBlockContentType.TEXT,
      },
      {
        text: 'l, ',
        type: TextBlockContentType.TEXT,
      },
      {
        attrs: {
          name: 'full_name',
        },
        type: 'zvariable',
      },
      {
        text: '. It ',
        type: TextBlockContentType.TEXT,
      },
      {
        marks: [
          {
            attrs: {
              href: 'http://clara.org/',
            },
            type: MarkType.LINK,
          },
        ],
        text: 'is ',
        type: TextBlockContentType.TEXT,
      },
      {
        text: 've',
        type: TextBlockContentType.TEXT,
      },
      {
        marks: [
          {
            type: MarkType.ITALIC,
          },
          {
            type: MarkType.BOLD,
          },
        ],
        text: 'ry ',
        type: TextBlockContentType.TEXT,
      },
      {
        marks: [
          {
            attrs: {
              href: 'http://zetkin.org/',
            },
            type: MarkType.LINK,
          },
          {
            type: MarkType.ITALIC,
          },
          {
            type: MarkType.BOLD,
          },
        ],
        text: 'short',
        type: TextBlockContentType.TEXT,
      },
      {
        marks: [
          {
            type: MarkType.ITALIC,
          },
          {
            type: MarkType.BOLD,
          },
        ],
        text: '.',
        type: TextBlockContentType.TEXT,
      },
    ]);
  });
});
