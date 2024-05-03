import {
  EmailContentBlock,
  EmailContentInlineNode,
} from 'features/emails/types';

type BlockHandler = (block: EmailContentBlock) => EmailContentBlock | null;
type InlineHandler = (
  node: EmailContentInlineNode
) => EmailContentInlineNode | null;

type Callbacks = {
  handleBlock?: BlockHandler;
  handleInline?: InlineHandler;
};

function identity<T>(obj: T): T {
  return obj;
}

type EmailContent = {
  blocks: EmailContentBlock[];
};

export default class EmailContentTraverser {
  private _content: EmailContent;

  private _traverseInlineNodes(
    inputNodes: EmailContentInlineNode[],
    handleInline: InlineHandler
  ): EmailContentInlineNode[] {
    const output: EmailContentInlineNode[] = [];

    inputNodes.forEach((inputNode) => {
      const handledNode = handleInline(inputNode);

      if (handledNode) {
        if (handledNode.kind == 'bold' || handledNode.kind == 'link') {
          output.push({
            ...handledNode,
            content: this._traverseInlineNodes(
              handledNode.content,
              handleInline
            ),
          });
        } else {
          output.push(handledNode);
        }
      }
    });

    return output;
  }

  constructor(content: EmailContent) {
    this._content = content;
  }

  traverse(callbacks: Callbacks): EmailContent {
    const handleBlock = callbacks.handleBlock || identity;
    const handleInline = callbacks.handleInline || identity;

    const blocks: EmailContent['blocks'] = [];

    this._content.blocks.forEach((inputBlock) => {
      const handledBlock = handleBlock(inputBlock);

      if (handledBlock) {
        if (handledBlock.kind == 'header') {
          blocks.push({
            ...handledBlock,
            data: {
              ...handledBlock.data,
              content: this._traverseInlineNodes(
                handledBlock.data.content,
                handleInline
              ),
            },
          });
        } else if (handledBlock.kind == 'paragraph') {
          blocks.push({
            ...handledBlock,
            data: {
              ...handledBlock.data,
              content: this._traverseInlineNodes(
                handledBlock.data.content,
                handleInline
              ),
            },
          });
        } else {
          blocks.push(handledBlock);
        }
      }
    });

    return {
      blocks,
    };
  }
}
