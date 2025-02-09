import { ObjectMark, RemirrorJSON } from 'remirror';
import crypto from 'crypto';

import {
  BoldNode,
  EmailContentInlineNode,
  InlineNodeKind,
  ItalicNode,
  LinkNode,
} from 'features/emails/types';
import { MarkNode, MarkType, TextBlockContentType } from '../types';
import { remirrorVarsToInlineVars } from './variables';
import { VariableName } from '../extensions/VariableExtension';

const isObjectMark = (mark: string | ObjectMark): mark is ObjectMark => {
  return typeof mark != 'string';
};

export default function remirrorToInlineNodes(blockContent: RemirrorJSON[]) {
  const inlineNodes: EmailContentInlineNode[] = [];

  blockContent.forEach((block) => {
    if (block.type == TextBlockContentType.TEXT) {
      const text = block.text;
      const marks = block.marks;

      if (text) {
        if (marks) {
          let inlineNode: MarkNode = {
            kind: InlineNodeKind.STRING,
            value: text,
          };

          marks.forEach((mark) => {
            if (isObjectMark(mark)) {
              if (mark.type == MarkType.LINK && mark.attrs) {
                const newLinkNode: LinkNode = {
                  content: [inlineNode],
                  href: mark.attrs.href?.toString() || '',
                  kind: InlineNodeKind.LINK,
                  tag: crypto.randomUUID().slice(0, 8),
                };
                inlineNode = newLinkNode;
              } else if (mark.type == MarkType.BOLD) {
                const newBoldNode: BoldNode = {
                  content: [inlineNode],
                  kind: InlineNodeKind.BOLD,
                };
                inlineNode = newBoldNode;
              } else if (mark.type == MarkType.ITALIC) {
                const newItalicNode: ItalicNode = {
                  content: [inlineNode],
                  kind: InlineNodeKind.ITALIC,
                };
                inlineNode = newItalicNode;
              }
            }
          });

          inlineNodes.push(inlineNode);
        } else {
          inlineNodes.push({
            kind: InlineNodeKind.STRING,
            value: text,
          });
        }
      }
    } else if (block.type == TextBlockContentType.LINE_BREAK) {
      inlineNodes.push({ kind: InlineNodeKind.LINE_BREAK });
    } else if (block.type == TextBlockContentType.VARIABLE) {
      const name = block.attrs?.name?.toString();
      if (name) {
        inlineNodes.push({
          kind: InlineNodeKind.VARIABLE,
          name: remirrorVarsToInlineVars[name as VariableName],
        });
      }
    }
  });
  return inlineNodes;
}
