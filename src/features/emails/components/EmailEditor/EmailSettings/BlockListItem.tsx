import { FC } from 'react';
import { OutputBlockData } from '@editorjs/editorjs';

import { BLOCK_TYPES } from 'features/emails/types';
import blockHasErrors from './utils/blockHasErrors';
import ButtonBlockListItem from './ButtonBlockListItem';
import ImageBlockListItem from './ImageBlockListItem';
import TextBlockListItem from './TextBlockListItem';

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
  const hasErrors = blockHasErrors(block);

  if (block.type === BLOCK_TYPES.PARAGRAPH) {
    return (
      <TextBlockListItem
        data={block.data}
        hasErrors={hasErrors}
        selected={selected}
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
