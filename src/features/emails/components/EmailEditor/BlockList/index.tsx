import EditorJS from '@editorjs/editorjs';
import { OutputBlockData } from '@editorjs/editorjs';
import { Box, Collapse, Divider } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { FC, MutableRefObject } from 'react';

import { ButtonData } from '../tools/Button';
import ButtonSettings from '../tools/Button/ButtonSettings';
import messageIds from 'features/emails/l10n/messageIds';
import { Msg } from 'core/i18n';

enum BLOCK_TYPES {
  BUTTON = 'button',
  LIBRARY_IMAGE = 'libraryImage',
  PARAGRAPH = 'paragraph',
}

interface BlockListProps {
  apiRef: MutableRefObject<EditorJS | null>;
  blocks: OutputBlockData[];
  selectedBlockIndex: number;
}

const BlockList: FC<BlockListProps> = ({
  apiRef,
  blocks,
  selectedBlockIndex,
}) => {
  const currentBlock = blocks[selectedBlockIndex];

  return (
    <>
      {blocks.map((block, index) => {
        const expandable = block.type !== BLOCK_TYPES.PARAGRAPH;
        const expanded = index === selectedBlockIndex;
        return (
          <Box key={block.id}>
            <Box
              alignItems="center"
              display="flex"
              justifyContent="space-between"
              padding={1}
            >
              <Msg id={messageIds.tools.titles[block.type as BLOCK_TYPES]} />
              {expandable && !expanded && <ExpandMore color="secondary" />}
              {expandable && expanded && <ExpandLess color="secondary" />}
            </Box>
            <Collapse in={expanded}>
              {block.type == BLOCK_TYPES.BUTTON && (
                <Box padding={1}>
                  <ButtonSettings
                    onChange={(newUrl: ButtonData['url']) => {
                      if (currentBlock.id) {
                        apiRef.current?.blocks.update(currentBlock.id, {
                          ...currentBlock.data,
                          url: newUrl,
                        });
                      }
                    }}
                    url={currentBlock.data.url || ''}
                  />
                </Box>
              )}
            </Collapse>
            <Divider />
          </Box>
        );
      })}
    </>
  );
};

export default BlockList;
