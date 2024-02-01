export default function getAnchorTags(
  range: Range,
  findParentTag: (tagName: string) => HTMLElement | null
): Node[] {
  let node: Node | null = range.startContainer;
  const endNode = range.endContainer;
  const anchors: Node[] = [];

  const parentA = findParentTag('A');

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
