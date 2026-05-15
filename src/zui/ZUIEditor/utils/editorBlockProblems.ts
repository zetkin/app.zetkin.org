import isURL from 'validator/lib/isURL';
import { ObjectMark, RemirrorJSON } from 'remirror';

import {
  MarkType,
  RemirrorBlockType,
  TextBlockContentType,
} from 'zui/ZUIEditor/types';

export enum BlockProblem {
  INVALID_BUTTON_URL = 'invalidButtonURL',
  DEFAULT_BUTTON_TEXT = 'defaultButtonText',
  BUTTON_TEXT_MISSING = 'buttonTextMissing',
  INVALID_LINK_URL = 'invalidLinkURL',
}

export default function editorBlockProblems(
  block: RemirrorJSON,
  defaultButtonText?: string
) {
  const blockProblems: BlockProblem[] = [];

  if (block.type === RemirrorBlockType.BUTTON) {
    if (
      !block.attrs?.href ||
      !isURL(block.attrs?.href?.toString(), { require_protocol: true })
    ) {
      blockProblems.push(BlockProblem.INVALID_BUTTON_URL);
    }

    const textContent =
      block.content && block.content?.length > 0 ? block.content[0] : undefined;
    const buttonText = textContent?.text;

    const noButtonText =
      !buttonText || !buttonText.replaceAll('&nbsp;', '').trim().length;
    const hasDefaultButtonText =
      defaultButtonText && buttonText && buttonText == defaultButtonText;

    if (hasDefaultButtonText) {
      blockProblems.push(BlockProblem.DEFAULT_BUTTON_TEXT);
    } else if (noButtonText) {
      blockProblems.push(BlockProblem.BUTTON_TEXT_MISSING);
    }
  } else if (block.type === RemirrorBlockType.PARAGRAPH) {
    const linksInBlock: ObjectMark[] = [];

    const findLinkNodes = (node: RemirrorJSON) => {
      if (node.type === TextBlockContentType.TEXT) {
        const linkMark = node.marks?.find(
          (mark) => typeof mark === 'object' && mark.type === MarkType.LINK
        );
        if (linkMark && typeof linkMark === 'object') {
          linksInBlock.push(linkMark);
        }
      } else if (node.content) {
        node.content.forEach((node) => findLinkNodes(node));
      }
    };

    block.content?.forEach((contentNode) => {
      findLinkNodes(contentNode);
    });

    if (
      linksInBlock.some(
        (link) =>
          !isURL(link.attrs?.href?.toString() || '', { require_protocol: true })
      )
    ) {
      blockProblems.push(BlockProblem.INVALID_LINK_URL);
    }
  }

  return blockProblems;
}
