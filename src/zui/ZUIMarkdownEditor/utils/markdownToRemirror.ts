import { marked } from 'marked';
import { RemirrorJSON } from 'remirror';

import {
  MarkType,
  RemirrorBlockType,
  TextBlockContentType,
} from 'zui/ZUIEditor/types';
import Token = marked.Token;

type MarkdownAstNode = {
  children?: MarkdownAstNode[];
  depth?: number;
  ordered?: boolean;
  type: string;
  url?: string;
  value?: string;
};

function parseMarkdownToAst(markdown: string): MarkdownAstNode[] {
  const tokens = marked.lexer(markdown);

  function mapTokens(tokens: Token[]): MarkdownAstNode[] {
    const result: MarkdownAstNode[] = [];

    for (const token of tokens) {
      if (token.type === 'paragraph') {
        result.push({
          children: mapInline(token.tokens || []),
          type: 'paragraph',
        });
      } else if (token.type === 'heading') {
        result.push({
          children: mapInline(token.tokens || []),
          depth: token.depth,
          type: 'heading',
        });
      } else if (token.type === 'list') {
        result.push({
          children: token.items.map((item) => ({
            children: [
              {
                children: mapInline(item.tokens || []),
                type: 'paragraph',
              },
            ],
            type: 'listItem',
          })),
          ordered: token.ordered,
          type: 'list',
        });
      } else if (token.type === 'blockquote') {
        result.push({
          children: mapTokens(token.tokens || []),
          type: 'blockquote',
        });
      } else if (token.type === 'code') {
        result.push({
          type: 'code',
          value: token.text,
        });
      } else if (token.type === 'hr') {
        result.push({
          type: 'thematicBreak',
        });
      }
    }

    return result;
  }

  function mapInline(tokens: Token[]): MarkdownAstNode[] {
    const result: MarkdownAstNode[] = [];

    for (const token of tokens) {
      if (token.type === 'text') {
        result.push({
          type: 'text',
          value: token.text,
        });
      } else if (token.type === 'strong') {
        result.push({
          children: mapInline(token.tokens || []),
          type: 'strong',
        });
      } else if (token.type === 'em') {
        result.push({
          children: mapInline(token.tokens || []),
          type: 'emphasis',
        });
      } else if (token.type === 'del') {
        result.push({
          children: mapInline(token.tokens || []),
          type: 'delete',
        });
      } else if (token.type === 'link') {
        result.push({
          children: mapInline(token.tokens || []),
          type: 'link',
          url: token.href,
        });
      } else if (token.type === 'codespan') {
        result.push({
          type: 'inlineCode',
          value: token.text,
        });
      } else if (token.type === 'br') {
        result.push({
          type: 'break',
        });
      }
    }

    return result;
  }

  return mapTokens(tokens);
}

function convertAstToRemirror(nodes: MarkdownAstNode[]): RemirrorJSON[] {
  const blocks: RemirrorJSON[] = [];

  for (const node of nodes) {
    if (node.type === 'paragraph') {
      const content = convertInlineToRemirror(node.children || []);
      blocks.push({
        content,
        type: RemirrorBlockType.PARAGRAPH,
      });
    } else if (node.type === 'heading') {
      const content = convertInlineToRemirror(node.children || []);
      blocks.push({
        attrs: { level: node.depth || 1 },
        content,
        type: RemirrorBlockType.HEADING,
      });
    } else if (node.type === 'list') {
      const listType = node.ordered
        ? RemirrorBlockType.ORDERED_LIST
        : RemirrorBlockType.BULLET_LIST;

      const listItems: RemirrorJSON[] = [];

      for (const item of node.children || []) {
        if (item.type !== 'listItem') {
          continue;
        }

        const itemContent: RemirrorJSON[] = [];

        for (const child of item.children || []) {
          if (child.type === 'paragraph') {
            itemContent.push({
              content: convertInlineToRemirror(child.children || []),
              type: RemirrorBlockType.PARAGRAPH,
            });
          } else if (child.type === 'list') {
            itemContent.push(...convertAstToRemirror([child]));
          }
        }

        listItems.push({
          content:
            itemContent.length > 0
              ? itemContent
              : [
                  {
                    content: [{ text: '', type: TextBlockContentType.TEXT }],
                    type: RemirrorBlockType.PARAGRAPH,
                  },
                ],
          type: RemirrorBlockType.LIST_ITEM,
        });
      }

      blocks.push({
        content: listItems,
        type: listType,
      });
    } else if (node.type === 'blockquote') {
      const content = convertInlineToRemirror(node.children || []);
      blocks.push({
        content,
        type: RemirrorBlockType.PARAGRAPH,
      });
    } else if (node.type === 'code') {
      const text = node.value || '';
      blocks.push({
        content: [{ text, type: TextBlockContentType.TEXT }],
        type: RemirrorBlockType.PARAGRAPH,
      });
    } else if (node.type === 'thematicBreak') {
      blocks.push({
        content: [{ text: '', type: TextBlockContentType.TEXT }],
        type: RemirrorBlockType.PARAGRAPH,
      });
    }
  }

  return blocks;
}

function convertInlineToRemirror(nodes: MarkdownAstNode[]): RemirrorJSON[] {
  const content: RemirrorJSON[] = [];

  for (const node of nodes) {
    if (node.type === 'text') {
      content.push({
        text: node.value || '',
        type: TextBlockContentType.TEXT,
      });
    } else if (node.type === 'strong') {
      const inner = convertInlineToRemirror(node.children || []);
      for (const item of inner) {
        if (item.type === TextBlockContentType.TEXT) {
          item.marks = [...(item.marks || []), { type: MarkType.BOLD }];
        }
      }
      content.push(...inner);
    } else if (node.type === 'emphasis') {
      const inner = convertInlineToRemirror(node.children || []);
      for (const item of inner) {
        if (item.type === TextBlockContentType.TEXT) {
          item.marks = [...(item.marks || []), { type: MarkType.ITALIC }];
        }
      }
      content.push(...inner);
    } else if (node.type === 'delete') {
      const inner = convertInlineToRemirror(node.children || []);
      for (const item of inner) {
        if (item.type === TextBlockContentType.TEXT) {
          item.marks = [...(item.marks || []), { type: MarkType.STRIKE }];
        }
      }
      content.push(...inner);
    } else if (node.type === 'link') {
      const inner = convertInlineToRemirror(node.children || []);
      for (const item of inner) {
        if (item.type === TextBlockContentType.TEXT) {
          item.marks = [
            ...(item.marks || []),
            { attrs: { href: node.url || '' }, type: MarkType.LINK },
          ];
        }
      }
      content.push(...inner);
    } else if (node.type === 'inlineCode') {
      content.push({
        text: node.value || '',
        type: TextBlockContentType.TEXT,
      });
    } else if (node.type === 'break') {
      content.push({ type: TextBlockContentType.LINE_BREAK });
    }
  }

  return content;
}

export function markdownToRemirror(markdownString: string): RemirrorJSON[] {
  if (!markdownString || markdownString.trim() === '') {
    return [
      {
        content: [{ text: '', type: TextBlockContentType.TEXT }],
        type: RemirrorBlockType.PARAGRAPH,
      },
    ];
  }

  const ast = parseMarkdownToAst(markdownString);
  return convertAstToRemirror(ast);
}
