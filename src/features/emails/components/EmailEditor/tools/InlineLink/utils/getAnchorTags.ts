import { API } from '@editorjs/editorjs';

export default function getAnchorTags(range: Range, api: API): Node[] {
  let node: Node | null = range.startContainer;
  const endNode = range.endContainer;
  const anchors: Node[] = [];

  const parentA = api.selection.findParentTag('A');

  if (parentA) {
    anchors.push(parentA);
  }

  while (node && node !== endNode) {
    if (node.nodeName == 'A') {
      anchors.push(node);
    }

    node = node.nextSibling;
  }

  return anchors;
}
