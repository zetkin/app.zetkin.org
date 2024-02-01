export default function getAnchorTag(
  selection: Selection | null,
  findParentTag: (tagName: string) => HTMLElement | null
): HTMLElement | null {
  if (!selection) {
    return null;
  }

  const selectedText = selection.toString();
  const range = selection.getRangeAt(0);

  const startSibling = range.startContainer.nextSibling;
  const endSibling = range.endContainer.previousSibling;

  if (
    startSibling === endSibling &&
    startSibling?.textContent === selectedText
  ) {
    return startSibling as HTMLElement;
  } else {
    return findParentTag('A');
  }
}
