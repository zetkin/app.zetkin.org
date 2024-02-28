import { EmailContentInlineNode, InlineNodeKind } from '../types';

function childNodesToInlineNodes(childNodes: ChildNode[]) {
  const inlineNodes: EmailContentInlineNode[] = [];

  childNodes.forEach((node) => {
    if (node.nodeName === '#text') {
      inlineNodes.push({
        kind: InlineNodeKind.STRING,
        value: node.nodeValue || '',
      });
    } else if (node.nodeName === 'BR') {
      inlineNodes.push({
        kind: InlineNodeKind.LINE_BREAK,
      });
    } else if (node.nodeName === 'I') {
      inlineNodes.push({
        content: childNodesToInlineNodes(Array.from(node.childNodes)),
        kind: InlineNodeKind.ITALIC,
      });
    } else if (node.nodeName === 'B') {
      inlineNodes.push({
        content: childNodesToInlineNodes(Array.from(node.childNodes)),
        kind: InlineNodeKind.BOLD,
      });
    } else if (node.nodeName === 'A') {
      const anchor = node as HTMLAnchorElement;
      inlineNodes.push({
        content: childNodesToInlineNodes(Array.from(node.childNodes)),
        href: anchor.href,
        kind: InlineNodeKind.LINK,
      });
    } else if (node.nodeName === 'SPAN') {
      const span = node as HTMLSpanElement;
      inlineNodes.push({
        kind: InlineNodeKind.VARIABLE,
        name: span.getAttribute('data-slug') || '',
      });
    }
  });

  return inlineNodes;
}

export default function htmlToInlineNodes(html: string) {
  const div = document.createElement('div');
  div.innerHTML = html;
  const childNodeArray = Array.from(div.childNodes);

  return childNodesToInlineNodes(childNodeArray);
}
