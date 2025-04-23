import { BlockKind, ButtonBlock, InlineNodeKind } from 'features/emails/types';
import remirrorToZetkin from './remirrorToZetkin';
import {
  RemirrorBlockType,
  EmailVariable,
  MarkType,
  TextBlockContentType,
} from '../types';

describe('remirrorToZetkin', () => {
  it('does nothing when passed an empty array', () => {
    const zetkinBlocks = remirrorToZetkin([]);

    expect(zetkinBlocks).toHaveLength(0);
  });

  it('converts an image block', () => {
    const zetkinBlocks = remirrorToZetkin([
      {
        attrs: {
          alt: 'clara.jpg',
          fileId: 2,
          src: 'http://files.zetkin.org/1/clara.jpg',
        },
        type: RemirrorBlockType.IMAGE,
      },
    ]);

    expect(zetkinBlocks).toEqual([
      {
        data: {
          alt: 'clara.jpg',
          fileId: 2,
          src: 'http://files.zetkin.org/1/clara.jpg',
        },
        kind: BlockKind.IMAGE,
      },
    ]);
  });

  it('converts a button block', () => {
    const zetkinBlocks = remirrorToZetkin([
      {
        attrs: {
          href: 'http://www.zetkin.org',
        },
        content: [
          {
            text: 'Click me!',
            type: TextBlockContentType.TEXT,
          },
        ],
        type: RemirrorBlockType.BUTTON,
      },
    ]);

    const block: ButtonBlock = zetkinBlocks[0] as ButtonBlock;

    expect(block.kind).toBe(BlockKind.BUTTON);
    expect(block.data.href).toEqual('http://www.zetkin.org');
    expect(block.data.text).toEqual('Click me!');
    expect(block.data.tag).toHaveLength(8);
  });

  it('adds unique tag to button block', () => {
    const zetkinBlocks = remirrorToZetkin([
      {
        attrs: {
          href: 'http://www.zetkin.org',
        },
        content: [
          {
            text: 'Click me!',
            type: TextBlockContentType.TEXT,
          },
        ],
        type: RemirrorBlockType.BUTTON,
      },
      {
        attrs: {
          href: 'http://www.clara.org',
        },
        content: [
          {
            text: 'No, click me!',
            type: TextBlockContentType.TEXT,
          },
        ],
        type: RemirrorBlockType.BUTTON,
      },
    ]);

    const block1 = zetkinBlocks[0] as ButtonBlock;
    const block2 = zetkinBlocks[1] as ButtonBlock;

    expect(block1.data.tag).toHaveLength(8);
    expect(block2.data.tag).toHaveLength(8);
    expect(block1.data.tag).not.toEqual(block2.data.tag);
  });

  it('converts a header block', () => {
    const zetkinBlocks = remirrorToZetkin([
      {
        attrs: {
          level: 1,
        },
        content: [
          {
            text: 'Hello!',
            type: TextBlockContentType.TEXT,
          },
          {
            attrs: { name: 'first_name' },
            type: TextBlockContentType.VARIABLE,
          },
        ],
        type: RemirrorBlockType.HEADING,
      },
    ]);

    expect(zetkinBlocks).toEqual([
      {
        data: {
          content: [
            {
              kind: InlineNodeKind.STRING,
              value: 'Hello!',
            },
            { kind: InlineNodeKind.VARIABLE, name: EmailVariable.FIRST_NAME },
          ],
          level: 1,
        },
        kind: BlockKind.HEADER,
      },
    ]);
  });

  it('converts paragraph block', () => {
    const zetkinBlocks = remirrorToZetkin([
      {
        content: [
          {
            text: 'Welcome to our cool ',
            type: TextBlockContentType.TEXT,
          },
          {
            marks: [{ type: MarkType.BOLD }],
            text: 'party!',
            type: TextBlockContentType.TEXT,
          },
        ],
        type: RemirrorBlockType.PARAGRAPH,
      },
    ]);

    expect(zetkinBlocks).toEqual([
      {
        data: {
          content: [
            {
              kind: InlineNodeKind.STRING,
              value: 'Welcome to our cool ',
            },
            {
              content: [
                {
                  kind: InlineNodeKind.STRING,
                  value: 'party!',
                },
              ],
              kind: InlineNodeKind.BOLD,
            },
          ],
        },
        kind: BlockKind.PARAGRAPH,
      },
    ]);
  });
});
