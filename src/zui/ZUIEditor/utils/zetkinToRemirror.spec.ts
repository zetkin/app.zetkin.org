import { BlockKind, InlineNodeKind } from 'features/emails/types';
import zetkinToRemirror from './zetkinToRemirror';
import {
  EmailVariable,
  MarkType,
  RemirrorBlockType,
  TextBlockContentType,
} from '../types';

describe('zetkinToRemirror()', () => {
  it('returns an empty array when it recieves an empty array', () => {
    const remirrorBlocks = zetkinToRemirror([]);

    expect(remirrorBlocks).toHaveLength(0);
  });

  it('converts Button blocks', () => {
    const remirrorBlocks = zetkinToRemirror([
      {
        data: {
          href: 'http://www.zetkin.org/',
          tag: 'abcdefgh',
          text: 'Click me!',
        },
        kind: BlockKind.BUTTON,
      },
    ]);

    expect(remirrorBlocks).toMatchObject([
      {
        attrs: {
          href: 'http://www.zetkin.org/',
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
  });

  it('converts Header blocks', () => {
    const remirrorBlocks = zetkinToRemirror([
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

    expect(remirrorBlocks).toMatchObject([
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
  });

  it('converts Image blocks', () => {
    const remirrorBlocks = zetkinToRemirror([
      {
        data: {
          alt: 'clara.jpg',
          fileId: 18,
          src: 'http://files.zetkin.org/1/clara.jpg',
        },
        kind: BlockKind.IMAGE,
      },
    ]);

    expect(remirrorBlocks).toMatchObject([
      {
        attrs: {
          alt: 'clara.jpg',
          fileId: 18,
          src: 'http://files.zetkin.org/1/clara.jpg',
        },
        type: RemirrorBlockType.IMAGE,
      },
    ]);
  });

  it('converts Paragraph blocks', () => {
    const remirrorBlocks = zetkinToRemirror([
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

    expect(remirrorBlocks).toMatchObject([
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
  });
});
