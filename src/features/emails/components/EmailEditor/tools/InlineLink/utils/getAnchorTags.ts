export default function getAnchorTags(range: Range): HTMLAnchorElement[] {
  const anchors: HTMLAnchorElement[] = [];

  const ancestor = range.commonAncestorContainer;
  if (ancestor.nodeType == Node.TEXT_NODE) {
    if (ancestor.parentElement?.tagName == 'A') {
      return [ancestor.parentElement as HTMLAnchorElement];
    }

    return [];
  }

  const container = ancestor as HTMLElement;
  if (container.tagName == 'A') {
    return [container as HTMLAnchorElement];
  }

  // Container is not text or A, so look for A decendents
  container.querySelectorAll('a').forEach((anchor) => {
    if (range.intersectsNode(anchor)) {
      anchors.push(anchor);
    }
  });

  return anchors;
}
