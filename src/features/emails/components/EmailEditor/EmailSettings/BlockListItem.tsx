import EditorJS from '@editorjs/editorjs';
import { OutputBlockData } from '@editorjs/editorjs';
import { FC, MutableRefObject } from 'react';

import { BLOCK_TYPES } from 'features/emails/types';
import BlockListItemBase from './BlockListItemBase';
import ButtonBlockListItem from './ButtonBlockListItem';
import { ButtonData } from '../tools/Button';
import checkBlockErrors from './utils/checkBlockErrors';
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
  const hasErrors = checkBlockErrors(block);

  if (block.type === BLOCK_TYPES.PARAGRAPH) {
    return (
      <BlockListItemBase
        excerpt={block.data.text}
        hasErrors={hasErrors}
        selected={selected}
        title={messages.editor.tools.titles.paragraph()}
      />
    );
  } else if (block.type === BLOCK_TYPES.BUTTON) {
    return (
      <ButtonBlockListItem
        data={block.data}
        hasErrors={hasErrors}
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
        hasErrors={hasErrors}
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
