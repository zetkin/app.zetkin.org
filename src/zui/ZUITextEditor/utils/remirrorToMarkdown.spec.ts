import { describe, expect, it } from '@jest/globals';

import { remirrorToMarkdown } from './remirrorToMarkdown';
import {
  MarkType,
  RemirrorBlockType,
  TextBlockContentType,
} from 'zui/ZUIEditor/types';
import { markdownToRemirror } from 'zui/ZUITextEditor/utils/markdownToRemirror';

describe('remirrorToMarkdown()', () => {
  it('returns empty string for empty array', () => {
    const result = remirrorToMarkdown([]);
    expect(result).toBe('');
  });

  it('returns empty string for undefined', () => {
    const result = remirrorToMarkdown(undefined as never);
    expect(result).toBe('');
  });

  it('converts plain text paragraph', () => {
    const result = remirrorToMarkdown([
      {
        content: [{ text: 'Hello world', type: TextBlockContentType.TEXT }],
        type: RemirrorBlockType.PARAGRAPH,
      },
    ]);
    expect(result).toContain('Hello world');
  });

  it('converts bold text', () => {
    const result = remirrorToMarkdown([
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
    expect(result).toContain('**bold text**');
  });

  it('converts italic text', () => {
    const result = remirrorToMarkdown([
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
    expect(result).toContain('*italic text*');
  });

  it('converts strikethrough text', () => {
    const result = remirrorToMarkdown([
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
    expect(result).toContain('~~strikethrough~~');
  });

  it('converts link', () => {
    const result = remirrorToMarkdown([
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
    expect(result).toContain('[Zetkin](https://zetkin.org)');
  });

  it('converts heading level 1', () => {
    const result = remirrorToMarkdown([
      {
        attrs: { level: 1 },
        content: [{ text: 'Heading 1', type: TextBlockContentType.TEXT }],
        type: RemirrorBlockType.HEADING,
      },
    ]);
    expect(result).toContain('# Heading 1');
  });

  it('converts heading level 2', () => {
    const result = remirrorToMarkdown([
      {
        attrs: { level: 2 },
        content: [{ text: 'Heading 2', type: TextBlockContentType.TEXT }],
        type: RemirrorBlockType.HEADING,
      },
    ]);
    expect(result).toContain('## Heading 2');
  });

  it('converts heading level 3', () => {
    const result = remirrorToMarkdown([
      {
        attrs: { level: 3 },
        content: [{ text: 'Heading 3', type: TextBlockContentType.TEXT }],
        type: RemirrorBlockType.HEADING,
      },
    ]);
    expect(result).toContain('### Heading 3');
  });

  it('converts bullet list', () => {
    const result = remirrorToMarkdown([
      {
        content: [
          {
            content: [{ text: 'item 1', type: TextBlockContentType.TEXT }],
            type: 'listItem',
          },
          {
            content: [{ text: 'item 2', type: TextBlockContentType.TEXT }],
            type: 'listItem',
          },
        ],
        type: RemirrorBlockType.BULLET_LIST,
      },
    ]);
    expect(result).toContain('- item 1');
    expect(result).toContain('- item 2');
  });

  it('converts ordered list', () => {
    const result = remirrorToMarkdown([
      {
        content: [
          {
            content: [{ text: 'item 1', type: TextBlockContentType.TEXT }],
            type: 'listItem',
          },
          {
            content: [{ text: 'item 2', type: TextBlockContentType.TEXT }],
            type: 'listItem',
          },
        ],
        type: RemirrorBlockType.ORDERED_LIST,
      },
    ]);
    expect(result).toContain('1. item 1');
    expect(result).toContain('2. item 2');
  });

  it('converts ordered list', () => {
    const input = [
      {
        content: [
          {
            content: [
              {
                content: [{ text: 'item 1', type: TextBlockContentType.TEXT }],
                type: RemirrorBlockType.PARAGRAPH,
              },
            ],
            type: 'listItem',
          },
          {
            content: [
              {
                content: [{ text: 'item 2', type: TextBlockContentType.TEXT }],
                type: RemirrorBlockType.PARAGRAPH,
              },
            ],
            type: 'listItem',
          },
        ],
        type: RemirrorBlockType.ORDERED_LIST,
      },
    ];
    const result = remirrorToMarkdown(input);
    expect(result).toContain('1. item 1');
    expect(result).toContain('2. item 2');
  });

  it('handles bold and italic combined', () => {
    const result = remirrorToMarkdown([
      {
        content: [
          {
            marks: [{ type: MarkType.BOLD }, { type: MarkType.ITALIC }],
            text: 'bold and italic',
            type: TextBlockContentType.TEXT,
          },
        ],
        type: RemirrorBlockType.PARAGRAPH,
      },
    ]);
    expect(result).toContain('**bold and italic**');
  });

  it('round-trips markdown -> remirror -> markdown with all features', () => {
    const input = `
# Heading 1

## Heading 2

Normal paragraph with **bold**, *italic*, and ~~strike~~.

A [link](https://example.com) inside text.

- Bullet 1
- Bullet 2 with **bold**
- Bullet 3 with *italic*

1. First item
2. Second item with ~~strike~~

Another paragraph
with a line break.
`.trim();

    const remirror = markdownToRemirror(input);
    const output = remirrorToMarkdown(remirror);

    expect(output).toBe(input);
  });
});
