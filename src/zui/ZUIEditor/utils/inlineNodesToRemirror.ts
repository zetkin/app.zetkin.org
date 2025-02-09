import { ObjectMark, RemirrorJSON } from 'remirror';

import {
  BoldNode,
  EmailContentInlineNode,
  InlineNodeKind,
  ItalicNode,
  LinkNode,
} from 'features/emails/types';
import { MarkType, TextBlockContentType } from '../types';
import { inlineVarsToRemirrorVars } from './variables';

type InlineNodeWithContent = ItalicNode | BoldNode | LinkNode;

const markTypes: Record<InlineNodeWithContent['kind'], MarkType> = {
  bold: MarkType.BOLD,
  italic: MarkType.ITALIC,
  link: MarkType.LINK,
};

const isNodeWithContent = (
  node: EmailContentInlineNode
): node is InlineNodeWithContent => {
  return 'content' in node;
};

export default function inlineNodesToRemirror(
  inlineNodes: EmailContentInlineNode[]
) {
  const content: RemirrorJSON[] = [];
  inlineNodes.forEach((node) => {
    {
      if (isNodeWithContent(node)) {
        //Is a node of type BOLD, ITALIC or LINK
        const marks: ObjectMark[] = [];
        let text = '';

        const findMarks = (markNode: EmailContentInlineNode) => {
          if (isNodeWithContent(markNode)) {
            if (markNode.kind == InlineNodeKind.LINK) {
              marks.push({
                attrs: { href: markNode.href },
                type: markTypes[markNode.kind],
              });
            } else {
              marks.push({ type: markTypes[markNode.kind] });
            }

            const childNode = markNode.content[0];
            if (isNodeWithContent(childNode)) {
              findMarks(childNode);
            } else if (childNode.kind == InlineNodeKind.STRING) {
              text = childNode.value;
            }
          }
        };

        findMarks(node);

        content.push({
          marks: marks.length > 0 ? marks : undefined,
          text: text,
          type: TextBlockContentType.TEXT,
        });
      } else if (node.kind == InlineNodeKind.STRING) {
        content.push({
          text: node.value,
          type: TextBlockContentType.TEXT,
        });
      } else if (node.kind == InlineNodeKind.LINE_BREAK) {
        content.push({ type: TextBlockContentType.LINE_BREAK });
      } else if (node.kind == InlineNodeKind.VARIABLE) {
        content.push({
          attrs: { name: inlineVarsToRemirrorVars[node.name] },
          type: TextBlockContentType.VARIABLE,
        });
      }
    }
  });

  return content;
}
