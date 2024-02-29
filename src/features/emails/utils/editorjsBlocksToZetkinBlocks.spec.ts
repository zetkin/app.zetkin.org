import editorjsBlocksToZetkinBlocks from './editorjsBlocksToZetkinBlocks';
import { BLOCK_TYPES, BlockKind, InlineNodeKind } from '../types';

describe('editorjsBlocksToZetkinBlocks()', () => {
  it('does nothing when passed an empty array', () => {
    const zetkinBlocks = editorjsBlocksToZetkinBlocks([]);

    expect(zetkinBlocks).toHaveLength(0);
  });

  it('converts Button block', () => {
    const zetkinBlocks = editorjsBlocksToZetkinBlocks([
      {
        data: {
          buttonText: 'Click me!',
          tag: 'abcdefgh',
          url: 'http://www.zetkin.org',
        },
        type: BLOCK_TYPES.BUTTON,
      },
    ]);

    expect(zetkinBlocks).toEqual([
      {
        data: {
          href: 'http://www.zetkin.org',
          tag: 'abcdefgh',
          text: 'Click me!',
        },
        kind: BlockKind.BUTTON,
      },
    ]);
  });

  it('converts header block', () => {
    const zetkinBlocks = editorjsBlocksToZetkinBlocks([
      {
        data: {
          level: 1,
          text: 'Hello!',
        },
        type: BLOCK_TYPES.HEADER,
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
          ],
          level: 1,
        },
        kind: BlockKind.HEADER,
      },
    ]);
  });

  it('converts image block', () => {
    const zetkinBlocks = editorjsBlocksToZetkinBlocks([
      {
        data: {
          fileName: 'clara.jpg',
          url: 'http://files.zetkin.org/1/clara.jpg',
        },
        type: BLOCK_TYPES.LIBRARY_IMAGE,
      },
    ]);

    expect(zetkinBlocks).toEqual([
      {
        data: {
          alt: 'clara.jpg',
          src: 'http://files.zetkin.org/1/clara.jpg',
        },
        kind: BlockKind.IMAGE,
      },
    ]);
  });

  it('converts paragraph block', () => {
    const zetkinBlocks = editorjsBlocksToZetkinBlocks([
      {
        data: {
          text: 'Welcome to our cool <b>party!</b>',
        },
        type: BLOCK_TYPES.PARAGRAPH,
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
