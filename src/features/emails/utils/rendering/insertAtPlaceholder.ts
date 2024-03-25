import { MJMLJsonObject, MJMLJsonWithChildren } from 'mjml-core';

/**
 * Recursively traverse the MJML tree of the frame to find the "placeholder"
 * component and replace it with the list of content components.
 */
export default function insertAtPlaceholder(
  frame: MJMLJsonObject,
  content: MJMLJsonObject[]
): MJMLJsonObject[] {
  if (frame.tagName == 'placeholder') {
    return content;
  } else if (hasChildren(frame)) {
    const children: MJMLJsonObject[] = [];

    frame.children.forEach((child) => {
      children.push(...insertAtPlaceholder(child, content));
    });

    return [
      {
        attributes: frame.attributes,
        children: children,
        tagName: frame.tagName,
      },
    ];
  } else {
    return [frame];
  }
}

function hasChildren(node: MJMLJsonObject): node is MJMLJsonWithChildren {
  return 'children' in node;
}
