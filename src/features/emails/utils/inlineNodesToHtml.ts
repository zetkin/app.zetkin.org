import { inlineVars } from './inlineVars';
import { EmailContentInlineNode, InlineNodeKind } from '../types';

export default function inlineNodesToHtml(
  nodes: EmailContentInlineNode[]
): string {
  let html = '';

  nodes.forEach((node) => {
    if (node.kind === InlineNodeKind.STRING) {
      html += node.value;
    } else if (node.kind === InlineNodeKind.BOLD) {
      html += `<b>${inlineNodesToHtml(node.content)}</b>`;
    } else if (node.kind === InlineNodeKind.ITALIC) {
      html += `<i>${inlineNodesToHtml(node.content)}</i>`;
    } else if (node.kind === InlineNodeKind.LINE_BREAK) {
      html += '<br>';
    } else if (node.kind === InlineNodeKind.VARIABLE) {
      html += `<span contenteditable="false" style="background-color: rgba(0, 0, 0, 0.1); padding: 0.1em 0.5em; border-radius: 1em; display: inline-block;" data-slug="target.first_name">${
        inlineVars[node.name]
      }</span>`;
    } else if (node.kind === InlineNodeKind.LINK) {
      html += `<a class="inlineLink" href="${node.href}" data-tag="${
        node.tag
      }">${inlineNodesToHtml(node.content)}</a>`;
    }
  });

  return html;
}
