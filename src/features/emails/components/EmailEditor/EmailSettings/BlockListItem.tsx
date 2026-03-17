import { Crop75, Image as ImageIcon, Notes, Title } from '@mui/icons-material';
import { FC, MouseEventHandler, RefObject } from 'react';

import {
  BlockKind,
  EmailContentBlock,
  EmailContentInlineNode,
  InlineNodeKind,
} from 'features/emails/types';
import BlockListItemBase from './BlockListItemBase';
import editorBlockProblems from 'zui/ZUIEditor/utils/editorBlockProblems';
import { useMessages } from 'core/i18n';
import emailMessageIds from 'features/emails/l10n/messageIds';
import editorMessageIds from 'zui/l10n/messageIds';

interface BlockListItemProps {
  block: EmailContentBlock;
  dropRef?: RefObject<HTMLDivElement | null>;
  isDragging?: boolean;
  isOver?: boolean;
  onSelect?: MouseEventHandler<HTMLDivElement>;
  selected: boolean;
}

const BlockListItem: FC<BlockListItemProps> = ({
  block,
  dropRef,
  isDragging,
  isOver,
  onSelect,
  selected,
}) => {
  const emailMessages = useMessages(emailMessageIds);
  const editorMessages = useMessages(editorMessageIds.editor);

  const makeTitle = (nodes: EmailContentInlineNode[]): string => {
    let text = '';
    nodes.forEach((node) => {
      if (node.kind == InlineNodeKind.STRING) {
        text += node.value;
      } else if (node.kind == InlineNodeKind.VARIABLE) {
        text += emailMessages.editor.outline.variables[node.name]();
      } else if ('content' in node) {
        text += makeTitle(node.content);
      }
    });
    return text;
  };

  if (block.kind === BlockKind.PARAGRAPH) {
    const title = makeTitle(block.data.content);
    const hasErrors = editorBlockProblems(block);
    return (
      <BlockListItemBase
        dropRef={dropRef}
        hasErrors={hasErrors.length > 0}
        icon={Notes}
        isDragging={isDragging}
        isOver={isOver}
        onSelect={onSelect}
        selected={selected}
        title={title}
      />
    );
  } else if (block.kind === BlockKind.HEADER) {
    const title = makeTitle(block.data.content);
    return (
      <BlockListItemBase
        dropRef={dropRef}
        hasErrors={false}
        icon={Title}
        isDragging={isDragging}
        isOver={isOver}
        onSelect={onSelect}
        selected={selected}
        title={title}
      />
    );
  } else if (block.kind === BlockKind.BUTTON) {
    const hasErrors = editorBlockProblems(
      block,
      editorMessages.extensions.button.defaultText()
    );
    return (
      <BlockListItemBase
        dropRef={dropRef}
        hasErrors={hasErrors.length > 0}
        icon={Crop75}
        isDragging={isDragging}
        isOver={isOver}
        onSelect={onSelect}
        selected={selected}
        title={block.data.text}
      />
    );
  } else {
    //Is image block
    return (
      <BlockListItemBase
        dropRef={dropRef}
        hasErrors={false}
        icon={ImageIcon}
        isDragging={isDragging}
        isOver={isOver}
        onSelect={onSelect}
        selected={selected}
        title={block.data.alt}
      />
    );
  }
};

export default BlockListItem;
