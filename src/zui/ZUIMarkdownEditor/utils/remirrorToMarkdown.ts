import { ObjectMark, RemirrorJSON } from 'remirror';

import {
  MarkType,
  RemirrorBlockType,
  TextBlockContentType,
} from 'zui/ZUIEditor/types';

function isObjectMark(mark: string | ObjectMark): mark is ObjectMark {
  return typeof mark === 'object' && mark !== null && 'type' in mark;
}

type AstNode = {
  children?: AstNode[];
  depth?: number;
  ordered?: boolean;
  type: string;
  url?: string;
  value?: string;
};

function convertRemirrorToInlineAst(content: RemirrorJSON[]): AstNode[] {
  const nodes: AstNode[] = [];

  for (const item of content) {
    if (item.type === TextBlockContentType.LINE_BREAK) {
      nodes.push({ type: 'break' });
    } else if (item.type === RemirrorBlockType.PARAGRAPH && item.content) {
      nodes.push(...convertRemirrorToInlineAst(item.content));
    } else if (item.type !== TextBlockContentType.TEXT) {
      continue;
    }

    const text = item.text || '';
    const marks = item.marks || [];
    const objectMarks = marks.filter(isObjectMark);

    const linkMark = objectMarks.find((m) => m.type === MarkType.LINK);
    const otherMarks = objectMarks.filter((m) => m.type !== MarkType.LINK);

    const hasLink = linkMark && linkMark.attrs?.href;

    if (!hasLink && otherMarks.length === 0) {
      nodes.push({ type: 'text', value: text });
      continue;
    }

    let current: AstNode;
    if (hasLink) {
      current = {
        children: [{ type: 'text', value: text }],
        type: 'link',
        url: linkMark.attrs!.href as string,
      };
    } else {
      current = { type: 'text', value: text };
    }

    for (const mark of otherMarks) {
      if (mark.type === MarkType.BOLD) {
        current = { children: [current], type: 'strong' };
      } else if (mark.type === MarkType.ITALIC) {
        current = { children: [current], type: 'emphasis' };
      } else if (mark.type === MarkType.STRIKE) {
        current = { children: [current], type: 'delete' };
      }
    }

    nodes.push(current);
  }

  return nodes;
}

function convertRemirrorToMarkdownAst(
  remirrorBlocks: RemirrorJSON[]
): AstNode[] {
  const nodes: AstNode[] = [];

  for (const block of remirrorBlocks) {
    if (block.type === RemirrorBlockType.PARAGRAPH) {
      const content = block.content as RemirrorJSON[] | undefined;
      const children = content ? convertRemirrorToInlineAst(content) : [];
      nodes.push({
        children,
        type: 'paragraph',
      });
    } else if (block.type === RemirrorBlockType.HEADING) {
      const content = block.content as RemirrorJSON[] | undefined;
      const children = content ? convertRemirrorToInlineAst(content) : [];
      const attrs = block.attrs as { level?: number } | undefined;
      nodes.push({
        children,
        depth: attrs?.level || 1,
        type: 'heading',
      });
    } else if (
      block.type === RemirrorBlockType.BULLET_LIST ||
      block.type === RemirrorBlockType.ORDERED_LIST
    ) {
      const content = block.content as RemirrorJSON[] | undefined;
      if (!content || content.length === 0) {
        continue;
      }

      const listItems: AstNode[] = [];
      for (const item of content) {
        const itemContent = item.content as RemirrorJSON[] | undefined;
        const children = itemContent
          ? convertRemirrorToInlineAst(itemContent)
          : [];
        if (children.length === 0) {
          continue;
        }
        listItems.push({
          children: [{ children, type: 'paragraph' }],
          type: 'listItem',
        });
      }

      nodes.push({
        children: listItems,
        ordered: block.type === RemirrorBlockType.ORDERED_LIST,
        type: 'list',
      });
    }
  }

  return nodes;
}

function stringifyAst(ast: AstNode[]): string {
  let result = '';

  for (const node of ast) {
    if (node.type === 'paragraph') {
      const children = node.children;
      if (!children) {
        continue;
      }

      for (const child of children) {
        result += stringifyInlineAst([child]);
      }

      result += '\n';
    } else if (node.type === 'heading') {
      const depth = (node as { depth?: number }).depth || 1;
      const prefix = '#'.repeat(depth);
      const children = node.children;

      if (children && children[0]) {
        result += `${prefix} ${stringifyInlineAst([children[0]])}\n`;
      }
    } else if (node.type === 'list') {
      const children = node.children;
      const isOrdered = (node as { ordered?: boolean }).ordered;
      if (!children) {
        continue;
      }

      let index = 1;
      for (const item of children) {
        const itemChildren = item.children;
        if (!itemChildren || !itemChildren[0]) {
          continue;
        }

        const paraChildren = itemChildren[0].children;
        if (!paraChildren) {
          continue;
        }

        const bullet = isOrdered ? `${index}.` : '-';
        result += `${bullet} ${stringifyInlineAst(paraChildren)}\n`;
        index++;
      }
    }

    result += '\n';
  }

  return result.trim();
}

function stringifyInlineAst(nodes: AstNode[]): string {
  let result = '';

  function stringifyNode(node: AstNode): string {
    if (node.type === 'text') {
      return node.value || '';
    } else if (node.type === 'strong') {
      const childArray = node.children || [];
      const inner = childArray.map((child) => stringifyNode(child)).join('');
      return `**${inner}**`;
    } else if (node.type === 'emphasis') {
      const childArray = node.children || [];
      const inner = childArray.map((child) => stringifyNode(child)).join('');
      return `*${inner}*`;
    } else if (node.type === 'delete') {
      const childArray = node.children || [];
      const inner = childArray.map((child) => stringifyNode(child)).join('');
      return `~~${inner}~~`;
    } else if (node.type === 'link') {
      const childArray = node.children || [];
      const inner = childArray.map((child) => stringifyNode(child)).join('');
      const url = node.url || '';
      return `[${inner}](${url})`;
    } else if (node.type === 'break') {
      return '\n';
    }
    return '';
  }

  for (const node of nodes) {
    result += stringifyNode(node);
  }

  return result;
}

export function remirrorToMarkdown(remirrorBlocks: RemirrorJSON[]): string {
  if (!remirrorBlocks || remirrorBlocks.length === 0) {
    return '';
  }

  const ast = convertRemirrorToMarkdownAst(remirrorBlocks);
  return stringifyAst(ast);
}
