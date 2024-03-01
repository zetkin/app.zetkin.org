import zetkinBlocksToEditorjsBlocks from './zetkinBlocksToEditorjsBlocks';
import { BLOCK_TYPES, BlockKind, InlineNodeKind } from '../types';

describe('zetkinBlocksToEditorjsBlocks()', () => {
  it('returns an empty array when it recieves an empty array', () => {
    const editorjsBlocks = zetkinBlocksToEditorjsBlocks([]);

    expect(editorjsBlocks).toHaveLength(0);
  });

  it('converts Button blocks', () => {
    const editorjsBlocks = zetkinBlocksToEditorjsBlocks([
      {
        data: {
          href: 'http://www.zetkin.org/',
          tag: 'abcdefgh',
          text: 'Click me!',
        },
        kind: BlockKind.BUTTON,
      },
    ]);

    editorjsBlocks.forEach((block) => (block.id = 'abcdefgh'));

    expect(editorjsBlocks).toEqual([
      {
        data: {
          buttonText: 'Click me!',
          tag: 'abcdefgh',
          url: 'http://www.zetkin.org/',
        },
        id: 'abcdefgh',
        type: BLOCK_TYPES.BUTTON,
      },
    ]);
  });

  it('converts Header blocks', () => {
    const editorjsBlocks = zetkinBlocksToEditorjsBlocks([
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

    editorjsBlocks.forEach((block) => (block.id = 'abcdefgh'));

    expect(editorjsBlocks).toEqual([
      {
        data: {
          level: 1,
          text: 'Hello!',
        },
        id: 'abcdefgh',
        type: BLOCK_TYPES.HEADER,
      },
    ]);
  });

  it('converts Image blocks', () => {
    const editorjsBlocks = zetkinBlocksToEditorjsBlocks([
      {
        data: {
          alt: 'clara.jpg',
          fileId: 18,
          src: 'http://files.zetkin.org/1/clara.jpg',
        },
        kind: BlockKind.IMAGE,
      },
    ]);

    editorjsBlocks.forEach((block) => (block.id = 'abcdefgh'));

    expect(editorjsBlocks).toEqual([
      {
        data: {
          fileId: 18,
          fileName: 'clara.jpg',
          url: 'http://files.zetkin.org/1/clara.jpg',
        },
        id: 'abcdefgh',
        type: BLOCK_TYPES.LIBRARY_IMAGE,
      },
    ]);
  });

  it('converts Paragraph blocks', () => {
    const editorjsBlocks = zetkinBlocksToEditorjsBlocks([
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

    editorjsBlocks.forEach((block) => (block.id = 'abcdefgh'));

    expect(editorjsBlocks).toEqual([
      {
        data: {
          text: 'Welcome to our cool <b>party!</b>',
        },
        id: 'abcdefgh',
        type: BLOCK_TYPES.PARAGRAPH,
      },
    ]);
  });
});
