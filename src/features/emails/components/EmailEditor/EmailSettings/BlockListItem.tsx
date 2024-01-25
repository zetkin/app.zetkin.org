import EditorJS from '@editorjs/editorjs';
import { OutputBlockData } from '@editorjs/editorjs';
import { FC, MutableRefObject } from 'react';

import { BLOCK_TYPES } from 'features/emails/types';
import BlockListItemBase from './BlockListItemBase';
import ButtonBlockListItem from './ButtonBlockListItem';
import { ButtonData } from '../tools/Button';
import ImageBlockListItem from './ImageBlockListItem';
import { LibraryImageData } from '../tools/LibraryImage/types';
import messageIds from 'features/emails/l10n/messageIds';
import { useMessages } from 'core/i18n';

interface BlockListItemProps {
  apiRef: MutableRefObject<EditorJS | null>;
  block: OutputBlockData;
  selected: boolean;
}

const BlockListItem: FC<BlockListItemProps> = ({ apiRef, block, selected }) => {
  const messages = useMessages(messageIds);

  if (block.type === BLOCK_TYPES.PARAGRAPH) {
    return (
      <BlockListItemBase
        excerpt={block.data.text}
        selected={selected}
        title={messages.editor.tools.titles.paragraph()}
      />
    );
  } else if (block.type === BLOCK_TYPES.BUTTON) {
    return (
      <ButtonBlockListItem
        data={block.data}
        onChange={(newData: ButtonData) => {
          if (block.id) {
            apiRef.current?.blocks.update(block.id, newData);
          }
        }}
        selected={selected}
      />
    );
  } else {
    return (
      <ImageBlockListItem
        data={block.data}
        onChange={(newData: LibraryImageData) => {
          if (block.id) {
            apiRef.current?.blocks.update(block.id, newData);
          }
        }}
        selected={selected}
      />
    );
  }
};

export default BlockListItem;
