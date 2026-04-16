import { describe, expect, it } from '@jest/globals';

import { markdownToRemirror } from './markdownToRemirror';
import {
  MarkType,
  RemirrorBlockType,
  TextBlockContentType,
} from 'zui/ZUIEditor/types';

describe('markdownToRemirror()', () => {
  it('returns empty paragraph for empty string', () => {
    const result = markdownToRemirror('');
    expect(result).toEqual([
      {
        content: [{ text: '', type: TextBlockContentType.TEXT }],
        type: RemirrorBlockType.PARAGRAPH,
      },
    ]);
  });

  it('returns empty paragraph for whitespace-only string', () => {
    const result = markdownToRemirror('   ');
    expect(result).toEqual([
      {
        content: [{ text: '', type: TextBlockContentType.TEXT }],
        type: RemirrorBlockType.PARAGRAPH,
      },
    ]);
  });

  it('converts plain text paragraph', () => {
    const result = markdownToRemirror('Hello world');
    expect(result).toEqual([
      {
        content: [{ text: 'Hello world', type: TextBlockContentType.TEXT }],
        type: RemirrorBlockType.PARAGRAPH,
      },
    ]);
  });

  it('converts bold text', () => {
    const result = markdownToRemirror('**bold text**');
    expect(result).toEqual([
      {
        content: [
          {
            marks: [{ type: MarkType.BOLD }],
            text: 'bold text',
            type: TextBlockContentType.TEXT,
          },
        ],
        type: RemirrorBlockType.PARAGRAPH,
      },
    ]);
  });

  it('converts italic text', () => {
    const result = markdownToRemirror('*italic text*');
    expect(result).toEqual([
      {
        content: [
          {
            marks: [{ type: MarkType.ITALIC }],
            text: 'italic text',
            type: TextBlockContentType.TEXT,
          },
        ],
        type: RemirrorBlockType.PARAGRAPH,
      },
    ]);
  });

  it('converts strikethrough text', () => {
    const result = markdownToRemirror('~~strikethrough~~');
    expect(result).toEqual([
      {
        content: [
          {
            marks: [{ type: MarkType.STRIKE }],
            text: 'strikethrough',
            type: TextBlockContentType.TEXT,
          },
        ],
        type: RemirrorBlockType.PARAGRAPH,
      },
    ]);
  });

  it('converts link', () => {
    const result = markdownToRemirror('[Zetkin](https://zetkin.org)');
    expect(result).toEqual([
      {
        content: [
          {
            marks: [
              { attrs: { href: 'https://zetkin.org' }, type: MarkType.LINK },
            ],
            text: 'Zetkin',
            type: TextBlockContentType.TEXT,
          },
        ],
        type: RemirrorBlockType.PARAGRAPH,
      },
    ]);
  });

  it('converts heading level 1', () => {
    const result = markdownToRemirror('# Heading 1');
    expect(result).toEqual([
      {
        attrs: { level: 1 },
        content: [{ text: 'Heading 1', type: TextBlockContentType.TEXT }],
        type: RemirrorBlockType.HEADING,
      },
    ]);
  });

  it('converts heading level 2', () => {
    const result = markdownToRemirror('## Heading 2');
    expect(result).toEqual([
      {
        attrs: { level: 2 },
        content: [{ text: 'Heading 2', type: TextBlockContentType.TEXT }],
        type: RemirrorBlockType.HEADING,
      },
    ]);
  });

  it('converts heading level 3', () => {
    const result = markdownToRemirror('### Heading 3');
    expect(result).toEqual([
      {
        attrs: { level: 3 },
        content: [{ text: 'Heading 3', type: TextBlockContentType.TEXT }],
        type: RemirrorBlockType.HEADING,
      },
    ]);
  });

  it('converts multiple paragraphs', () => {
    const result = markdownToRemirror('First paragraph\n\nSecond paragraph');
    expect(result).toHaveLength(2);
    expect(result[0].type).toBe(RemirrorBlockType.PARAGRAPH);
    expect(result[1].type).toBe(RemirrorBlockType.PARAGRAPH);
  });

  it('converts unordered list', () => {
    const result = markdownToRemirror('- Item 1\n- Item 2');

    expect(result).toEqual([
      {
        content: [
          {
            content: [
              {
                content: [{ text: 'Item 1', type: TextBlockContentType.TEXT }],
                type: RemirrorBlockType.PARAGRAPH,
              },
            ],
            type: RemirrorBlockType.LIST_ITEM,
          },
          {
            content: [
              {
                content: [{ text: 'Item 2', type: TextBlockContentType.TEXT }],
                type: RemirrorBlockType.PARAGRAPH,
              },
            ],
            type: RemirrorBlockType.LIST_ITEM,
          },
        ],
        type: RemirrorBlockType.BULLET_LIST,
      },
    ]);
  });

  it('converts ordered list', () => {
    const result = markdownToRemirror('1. First\n2. Second');

    expect(result).toEqual([
      {
        content: [
          {
            content: [
              {
                content: [{ text: 'First', type: TextBlockContentType.TEXT }],
                type: RemirrorBlockType.PARAGRAPH,
              },
            ],
            type: RemirrorBlockType.LIST_ITEM,
          },
          {
            content: [
              {
                content: [{ text: 'Second', type: TextBlockContentType.TEXT }],
                type: RemirrorBlockType.PARAGRAPH,
              },
            ],
            type: RemirrorBlockType.LIST_ITEM,
          },
        ],
        type: RemirrorBlockType.ORDERED_LIST,
      },
    ]);
  });
});
