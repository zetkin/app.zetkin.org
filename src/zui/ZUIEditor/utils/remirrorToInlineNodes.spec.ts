import {
  BoldNode,
  InlineNodeKind,
  ItalicNode,
  LinkNode,
  StringNode,
  VariableNode,
} from 'features/emails/types';
import remirrorToInlineNodes from './remirrorToInlineNodes';
import { EmailVariable, TextBlockContentType, MarkType } from '../types';

describe('remirrorToInlineNodes()', () => {
  it('returns an empty array when passed an empty array', () => {
    const inlineNodes = remirrorToInlineNodes([]);

    expect(inlineNodes).toHaveLength(0);
  });

  it('converts content with only plain text', () => {
    const nodes = remirrorToInlineNodes([
      {
        text: 'This is our whole email. It is very short.',
        type: TextBlockContentType.TEXT,
      },
    ]);

    expect(nodes.length).toEqual(1);
    expect(nodes[0]).toEqual({
      kind: InlineNodeKind.STRING,
      value: 'This is our whole email. It is very short.',
    });
  });

  it('converts content with a hard break in it', () => {
    const nodes = remirrorToInlineNodes([
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

  it('converts content with an italicized word in it', () => {
    const nodes = remirrorToInlineNodes([
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

    expect(nodes.length).toEqual(3);
    expect(nodes[0]).toEqual({
      kind: InlineNodeKind.STRING,
      value: 'This is our whole email. It is ',
    });
    expect(nodes[1]).toEqual({
      content: [
        {
          kind: InlineNodeKind.STRING,
          value: 'very',
        },
      ],
      kind: InlineNodeKind.ITALIC,
    });
    expect(nodes[2]).toEqual({
      kind: InlineNodeKind.STRING,
      value: ' short.',
    });
  });

  it('converts content with a bold word in it', () => {
    const nodes = remirrorToInlineNodes([
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

    expect(nodes.length).toEqual(3);
    expect(nodes[0]).toEqual({
      kind: InlineNodeKind.STRING,
      value: 'This is our whole email. It is ',
    });
    expect(nodes[1]).toEqual({
      content: [
        {
          kind: InlineNodeKind.STRING,
          value: 'very',
        },
      ],
      kind: InlineNodeKind.BOLD,
    });
    expect(nodes[2]).toEqual({
      kind: InlineNodeKind.STRING,
      value: ' short.',
    });
  });

  it('converts content with a link in it', () => {
    const nodes = remirrorToInlineNodes([
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

    const linkNode = nodes[1] as LinkNode;
    const stringNode = linkNode.content[0] as StringNode;

    expect(nodes.length).toEqual(3);
    expect(nodes[0]).toEqual({
      kind: InlineNodeKind.STRING,
      value: 'This is our whole email. It is ',
    });

    expect(linkNode.href).toEqual('http://www.zetkin.org');
    expect(linkNode.kind).toEqual(InlineNodeKind.LINK);
    expect(linkNode.tag).toHaveLength(8);
    expect(stringNode.value).toEqual('very');
    expect(stringNode.kind).toEqual(InlineNodeKind.STRING);

    expect(nodes[2]).toEqual({
      kind: InlineNodeKind.STRING,
      value: ' short.',
    });
  });

  it('converts content with a bold and italicized word in it', () => {
    const nodes = remirrorToInlineNodes([
      {
        text: 'This is our whole email. It is ',
        type: TextBlockContentType.TEXT,
      },
      {
        marks: [{ type: MarkType.BOLD }, { type: MarkType.ITALIC }],
        text: 'very',
        type: TextBlockContentType.TEXT,
      },
      {
        text: ' short.',
        type: TextBlockContentType.TEXT,
      },
    ]);

    expect(nodes.length).toEqual(3);
    expect(nodes[0]).toEqual({
      kind: InlineNodeKind.STRING,
      value: 'This is our whole email. It is ',
    });
    expect(nodes[1]).toEqual({
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
    });
    expect(nodes[2]).toEqual({
      kind: InlineNodeKind.STRING,
      value: ' short.',
    });
  });

  it('makes unique tags on links', () => {
    const nodes = remirrorToInlineNodes([
      {
        marks: [
          { attrs: { href: 'http://www.clara.org' }, type: MarkType.LINK },
        ],
        text: 'This is our whole email.',
        type: TextBlockContentType.TEXT,
      },
      {
        marks: [
          { attrs: { href: 'http://www.zetkin.org' }, type: MarkType.LINK },
        ],
        text: ' It is very short.',
        type: TextBlockContentType.TEXT,
      },
    ]);

    const linkNode1 = nodes[0] as LinkNode;
    const linkNode2 = nodes[1] as LinkNode;

    expect(nodes).toHaveLength(2);
    expect(linkNode1.tag).not.toEqual(linkNode2.tag);
  });

  it('converts content with a variable in it', () => {
    const nodes = remirrorToInlineNodes([
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

    expect(nodes).toEqual([
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
  });

  it('converts complex intersections of different marks and content types', () => {
    const nodes = remirrorToInlineNodes([
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
            type: MarkType.BOLD,
          },
          {
            type: MarkType.ITALIC,
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
            type: MarkType.BOLD,
          },
          {
            type: MarkType.ITALIC,
          },
        ],
        text: 'ry ',
        type: TextBlockContentType.TEXT,
      },
      {
        marks: [
          {
            type: MarkType.BOLD,
          },
          {
            type: MarkType.ITALIC,
          },
          {
            attrs: {
              href: 'http://zetkin.org/',
            },
            type: MarkType.LINK,
          },
        ],
        text: 'short',
        type: TextBlockContentType.TEXT,
      },
      {
        marks: [
          {
            type: MarkType.BOLD,
          },
          {
            type: MarkType.ITALIC,
          },
        ],
        text: '.',
        type: TextBlockContentType.TEXT,
      },
    ]);

    const node1 = nodes[0] as StringNode;
    const node2 = nodes[1] as ItalicNode;
    const node2a = node2.content[0] as StringNode;
    const node3 = nodes[2] as StringNode;
    const node4 = nodes[3] as BoldNode;
    const node4a = node4.content[0] as StringNode;
    const node5 = nodes[4] as BoldNode;
    const node5a = node5.content[0] as ItalicNode;
    const node5b = node5a.content[0] as StringNode;
    const node6 = nodes[5] as BoldNode;
    const node6a = node6.content[0] as StringNode;
    const node7 = nodes[6] as StringNode;
    const node8 = nodes[7] as VariableNode;
    const node9 = nodes[8] as StringNode;
    const node10 = nodes[9] as LinkNode;
    const node10a = node10.content[0] as StringNode;
    const node11 = nodes[10] as StringNode;
    const node12 = nodes[11] as ItalicNode;
    const node12a = node12.content[0] as BoldNode;
    const node12b = node12a.content[0] as StringNode;
    const node13 = nodes[12] as LinkNode;
    const node13a = node13.content[0] as ItalicNode;
    const node13b = node13a.content[0] as BoldNode;
    const node13c = node13b.content[0] as StringNode;
    const node14 = nodes[13] as ItalicNode;
    const node14a = node14.content[0] as BoldNode;
    const node14b = node14a.content[0] as StringNode;

    expect(node1).toEqual({ kind: 'string', value: 'Th' });

    expect(node2.kind).toEqual(InlineNodeKind.ITALIC);
    expect(node2a.value).toEqual('is i');
    expect(node2a.kind).toEqual(InlineNodeKind.STRING);

    expect(node3.kind).toEqual(InlineNodeKind.STRING);
    expect(node3.value).toEqual('s ');

    expect(node4.kind).toEqual(InlineNodeKind.BOLD);
    expect(node4a.kind).toEqual(InlineNodeKind.STRING);
    expect(node4a.value).toEqual('our who');

    expect(node5.kind).toEqual(InlineNodeKind.ITALIC);
    expect(node5a.kind).toEqual(InlineNodeKind.BOLD);
    expect(node5b.kind).toEqual(InlineNodeKind.STRING);
    expect(node5b.value).toEqual('le em');

    expect(node6.kind).toEqual(InlineNodeKind.BOLD);
    expect(node6a.kind).toEqual(InlineNodeKind.STRING);
    expect(node6a.value).toEqual('ai');

    expect(node7.kind).toEqual(InlineNodeKind.STRING);
    expect(node7.value).toEqual('l, ');

    expect(node8.kind).toEqual(InlineNodeKind.VARIABLE);
    expect(node8.name).toEqual(EmailVariable.FULL_NAME);

    expect(node9.kind).toEqual(InlineNodeKind.STRING);
    expect(node9.value).toEqual('. It ');

    expect(node10.kind).toEqual(InlineNodeKind.LINK);
    expect(node10.href).toEqual('http://clara.org/');
    expect(node10.tag).toHaveLength(8);
    expect(node10a.kind).toEqual(InlineNodeKind.STRING);
    expect(node10a.value).toEqual('is ');

    expect(node11.kind).toEqual(InlineNodeKind.STRING);
    expect(node11.value).toEqual('ve');

    expect(node12.kind).toEqual(InlineNodeKind.ITALIC);
    expect(node12a.kind).toEqual(InlineNodeKind.BOLD);
    expect(node12b.kind).toEqual(InlineNodeKind.STRING);
    expect(node12b.value).toEqual('ry ');

    expect(node13.kind).toEqual(InlineNodeKind.LINK);
    expect(node13.href).toEqual('http://zetkin.org/');
    expect(node13.tag).toHaveLength(8);
    expect(node13a.kind).toEqual(InlineNodeKind.ITALIC);
    expect(node13b.kind).toEqual(InlineNodeKind.BOLD);
    expect(node13c.kind).toEqual(InlineNodeKind.STRING);
    expect(node13c.value).toEqual('short');

    expect(node14.kind).toEqual(InlineNodeKind.ITALIC);
    expect(node14a.kind).toEqual(InlineNodeKind.BOLD);
    expect(node14b.kind).toEqual(InlineNodeKind.STRING);
    expect(node14b.value).toEqual('.');
  });
});
