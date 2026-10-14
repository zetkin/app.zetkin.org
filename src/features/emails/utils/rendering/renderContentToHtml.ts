import {
  BlockKind,
  EmailContent,
  EmailContentBlock,
  EmailContentInlineNode,
  InlineNodeKind,
} from 'features/emails/types';

type RenderOptions = {
  document?: boolean;
  title?: string;
};

function escapeText(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeAttr(value: string): string {
  return escapeText(value).replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function safeUrl(value: string): string {
  return /^https?:\/\//.test(value) ? escapeAttr(value) : '';
}

function renderInline(nodes: EmailContentInlineNode[]): string {
  return nodes
    .map((node) => {
      switch (node.kind) {
        case InlineNodeKind.STRING:
          return escapeText(node.value);
        case InlineNodeKind.BOLD:
          return `<b>${renderInline(node.content)}</b>`;
        case InlineNodeKind.ITALIC:
          return `<i>${renderInline(node.content)}</i>`;
        case InlineNodeKind.LINE_BREAK:
          return '<br>';
        case InlineNodeKind.LINK:
          return `<a class="email-link-${escapeAttr(
            node.tag
          )}" href="${safeUrl(node.href)}">${renderInline(node.content)}</a>`;
        case InlineNodeKind.VARIABLE:
          return `{{${escapeText(node.name)}}}`;
        default:
          return '';
      }
    })
    .join('');
}

function renderBlock(block: EmailContentBlock): string {
  switch (block.kind) {
    case BlockKind.PARAGRAPH:
      return `<p>${renderInline(block.data.content)}</p>`;
    case BlockKind.HEADER: {
      const level = [1, 2, 3, 4].includes(block.data.level)
        ? block.data.level
        : 1;
      return `<h${level}>${renderInline(block.data.content)}</h${level}>`;
    }
    case BlockKind.IMAGE:
      return `<img src="${safeUrl(block.data.src)}" alt="${escapeAttr(
        block.data.alt
      )}">`;
    case BlockKind.BUTTON:
      return `<a class="email-link-${escapeAttr(
        block.data.tag
      )}" href="${safeUrl(block.data.href)}">${escapeText(
        block.data.text
      )}</a>`;
    default:
      return '';
  }
}

export default function renderContentToHtml(
  content: EmailContent,
  options: RenderOptions = {}
): string {
  const fragment = content.blocks.map(renderBlock).join('\n');

  if (!options.document) {
    return fragment;
  }

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>${escapeText(options.title ?? '')}</title>
</head>
<body>
${fragment}
</body>
</html>`;
}
