import isURL from 'validator/lib/isURL';

import {
  BlockKind,
  BlockProblem,
  EmailContentBlock,
  EmailContentInlineNode,
  InlineNodeKind,
  LinkNode,
} from 'features/emails/types';

export default function editorBlockProblems(block: EmailContentBlock) {
  const blockProblems: BlockProblem[] = [];

  if (block.kind == BlockKind.BUTTON) {
    if (
      !block.data.href ||
      !isURL(block.data.href, { require_protocol: true })
    ) {
      blockProblems.push(BlockProblem.INVALID_BUTTON_URL);
    }

    const buttonText = block.data.text;
    if (!buttonText) {
      blockProblems.push(BlockProblem.DEFAULT_BUTTON_TEXT);
    } else if (!buttonText.replaceAll('&nbsp;', '').trim().length) {
      blockProblems.push(BlockProblem.BUTTON_TEXT_MISSING);
    }
  } else if (block.kind == BlockKind.PARAGRAPH) {
    const linksInBlock: LinkNode[] = [];

    const findLinkNodes = (node: EmailContentInlineNode) => {
      if (node.kind == InlineNodeKind.LINK) {
        linksInBlock.push(node);
      } else if ('content' in node) {
        node.content.forEach((node) => findLinkNodes(node));
      }
    };

    block.data.content.forEach((contentNode) => {
      findLinkNodes(contentNode);
    });

    if (
      linksInBlock.some((link) => !isURL(link.href, { require_protocol: true }))
    ) {
      blockProblems.push(BlockProblem.INVALID_LINK_URL);
    }
  }

  return blockProblems;
}
