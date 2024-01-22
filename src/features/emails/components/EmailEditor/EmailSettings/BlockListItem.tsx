import EditorJS from '@editorjs/editorjs';
import { OutputBlockData } from '@editorjs/editorjs';
import { Box, Collapse, Divider, Typography } from '@mui/material';
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

interface BlockListItemProps {
  apiRef: MutableRefObject<EditorJS | null>;
  block: OutputBlockData;
  expanded: boolean;
  onCollapse: () => void;
  onExpand: () => void;
  selected: boolean;
}

const BlockListItem: FC<BlockListItemProps> = ({
  apiRef,
  block,
  expanded,
  onCollapse,
  onExpand,
  selected,
}) => {
  const expandable = block.type !== BLOCK_TYPES.PARAGRAPH;

  return (
    <>
      <Box
        alignItems="center"
        display="flex"
        justifyContent="space-between"
        padding={1}
      >
        <Typography
          fontWeight={selected ? 'bold' : 'normal'}
          sx={{ cursor: 'default' }}
        >
          <Msg id={messageIds.editor.tools.titles[block.type as BLOCK_TYPES]} />
        </Typography>
        {expandable && !expanded && (
          <ExpandMore
            color="secondary"
            onClick={onExpand}
            sx={{ cursor: 'pointer' }}
          />
        )}
        {expandable && expanded && (
          <ExpandLess
            color="secondary"
            onClick={onCollapse}
            sx={{ cursor: 'pointer' }}
          />
        )}
      </Box>
      <Collapse in={expanded}>
        {block.type == BLOCK_TYPES.BUTTON && (
          <Box padding={1}>
            <ButtonSettings
              onChange={(newUrl: ButtonData['url']) => {
                if (block.id) {
                  apiRef.current?.blocks.update(block.id, {
                    ...block.data,
                    url: newUrl,
                  });
                }
              }}
              url={block.data.url || ''}
            />
          </Box>
        )}
      </Collapse>
      <Divider />
    </>
  );
};

export default BlockListItem;
