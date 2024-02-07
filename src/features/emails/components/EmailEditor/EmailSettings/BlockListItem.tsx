import { FC } from 'react';
import { OutputBlockData } from '@editorjs/editorjs';

import { BLOCK_TYPES } from 'features/emails/types';
import BlockListItemBase from './BlockListItemBase';
import ButtonBlockListItem from './ButtonBlockListItem';
import checkBlockErrors from './utils/checkBlockErrors';
import ImageBlockListItem from './ImageBlockListItem';
import messageIds from 'features/emails/l10n/messageIds';
import { useMessages } from 'core/i18n';

interface BlockListItemProps {
  block: OutputBlockData;
  onChange: (newData: OutputBlockData['data']) => void;
  selected: boolean;
}

const BlockListItem: FC<BlockListItemProps> = ({
  block,
  onChange,
  selected,
}) => {
  const messages = useMessages(messageIds);
  const hasErrors = checkBlockErrors(block);

  if (block.type === BLOCK_TYPES.PARAGRAPH) {
    return (
      <BlockListItemBase
        excerpt={block.data.text}
        hasErrors={hasErrors}
        selected={selected}
        title={messages.editor.tools.paragraph.title()}
      />
    );
  } else if (block.type === BLOCK_TYPES.BUTTON) {
    return (
      <ButtonBlockListItem
        data={block.data}
        hasErrors={hasErrors}
        onChange={onChange}
        selected={selected}
      />
    );
  } else {
    return (
      <ImageBlockListItem
        data={block.data}
        hasErrors={hasErrors}
        onChange={onChange}
        selected={selected}
      />
    );
  }
};

export default BlockListItem;
