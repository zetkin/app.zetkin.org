import EditorJS from '@editorjs/editorjs';
import { OutputBlockData } from '@editorjs/editorjs';
import { Box, Collapse, Divider, Typography } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { FC, MutableRefObject, useState } from 'react';

import { BLOCK_TYPES } from 'features/emails/types';
import { ButtonData } from '../tools/Button';
import ButtonSettings from '../tools/Button/ButtonSettings';
import { LibraryImageData } from '../tools/LibraryImage/types';
import LibraryImageSettings from '../tools/LibraryImage/LibraryImageSettings';
import messageIds from 'features/emails/l10n/messageIds';
import { Msg } from 'core/i18n';
import { useNumericRouteParams } from 'core/hooks';

interface BlockListItemProps {
  apiRef: MutableRefObject<EditorJS | null>;
  block: OutputBlockData;
  selected: boolean;
}

const BlockListItem: FC<BlockListItemProps> = ({ apiRef, block, selected }) => {
  //Getting the orgId from the route is potentially a bad idea.
  const { orgId } = useNumericRouteParams();
  const [expanded, setExpanded] = useState(true);
  const expandable = block.type !== BLOCK_TYPES.PARAGRAPH;

  return (
    <>
      <Box
        alignItems="center"
        display="flex"
        justifyContent="space-between"
        onClick={
          expandable && expanded
            ? () => setExpanded(false)
            : () => setExpanded(true)
        }
        padding={1}
        sx={{ cursor: expandable ? 'pointer' : 'default' }}
      >
        <Box alignItems="center" display="flex">
          <Typography
            fontWeight={selected ? 'bold' : 'normal'}
            sx={{ cursor: 'default', paddingRight: 1 }}
          >
            <Msg
              id={messageIds.editor.tools.titles[block.type as BLOCK_TYPES]}
            />
          </Typography>
        </Box>
        <Box
          alignItems="center"
          display="flex"
          justifyContent="space-between"
          width="75%"
        >
          <Typography
            color="secondary"
            maxWidth="80%"
            noWrap
            overflow="hidden"
            textOverflow="ellipsis"
            variant="body2"
          >
            {block.type === BLOCK_TYPES.LIBRARY_IMAGE && block.data.fileName}
            {block.type === BLOCK_TYPES.BUTTON && block.data.buttonText}
            {block.type === BLOCK_TYPES.PARAGRAPH && block.data.text}
          </Typography>
          {expandable && !expanded && <ExpandMore color="secondary" />}
          {expandable && expanded && <ExpandLess color="secondary" />}
        </Box>
      </Box>
      <Collapse in={expanded}>
        {block.type == BLOCK_TYPES.BUTTON && (
          <Box paddingBottom={1} paddingX={1}>
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
        {block.type === BLOCK_TYPES.LIBRARY_IMAGE && (
          <Box paddingBottom={2} paddingX={1}>
            <LibraryImageSettings
              data={block.data}
              onChange={(newData: LibraryImageData) => {
                if (block.id) {
                  apiRef.current?.blocks.update(block.id, newData);
                }
              }}
              orgId={orgId}
            />
          </Box>
        )}
      </Collapse>
      <Divider />
    </>
  );
};

export default BlockListItem;
