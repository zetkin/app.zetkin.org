import { FC } from 'react';
import { OutputBlockData } from '@editorjs/editorjs';

import { BLOCK_TYPES } from 'features/emails/types';
import blockProblems from './utils/blockProblems';
import ButtonBlockListItem from './ButtonBlockListItem';
import HeaderBlockListItem from './HeaderBlockListItem';
import ImageBlockListItem from './ImageBlockListItem';
import TextBlockListItem from './TextBlockListItem';

interface BlockListItemProps {
  block: OutputBlockData;
  onChange: (newData: OutputBlockData['data']) => void;
  readOnly: boolean;
  selected: boolean;
}

const BlockListItem: FC<BlockListItemProps> = ({
  block,
  onChange,
  readOnly,
  selected,
}) => {
  const problems = blockProblems(block);

  if (block.type === BLOCK_TYPES.PARAGRAPH) {
    return (
      <TextBlockListItem
        data={block.data}
        hasErrors={!!problems.length}
        readOnly={readOnly}
        selected={selected}
      />
    );
  } else if (block.type === BLOCK_TYPES.HEADER) {
    return <HeaderBlockListItem data={block.data} selected={selected} />;
  } else if (block.type === BLOCK_TYPES.BUTTON) {
    return (
      <ButtonBlockListItem
        data={block.data}
        hasErrors={!!problems.length}
        onChange={onChange}
        readOnly={readOnly}
        selected={selected}
      />
    );
  } else {
    return (
      <ImageBlockListItem
        data={block.data}
        hasErrors={!!problems.length}
        onChange={onChange}
        readOnly={readOnly}
        selected={selected}
      />
    );
  }
};

export default BlockListItem;
