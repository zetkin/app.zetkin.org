import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Typography,
} from '@mui/material';
import { FC, useState } from 'react';
import { FromToProps } from 'remirror';
import { MoreVert } from '@mui/icons-material';
import { useCommands } from '@remirror/react';

import MoveUpButton from '../buttons/MoveUpButton';
import MoveDownButton from '../buttons/MoveDownButton';
import DragHandle from '../buttons/DragHandle';
import { Msg } from 'core/i18n';
import messageIds from 'zui/l10n/messageIds';

type BlockToolbarBaseProps = {
  blockIndex: number;
  conversions?: { label: string; onClick: () => void }[];
  icon: JSX.Element;
  onDragEnd: () => void;
  onDragStart: (index: number) => void;
  range: FromToProps;
  title: string;
  tools?: JSX.Element;
};

const BlockToolbarBase: FC<BlockToolbarBaseProps> = ({
  blockIndex,
  conversions,
  icon,
  onDragEnd,
  onDragStart,
  range,
  title,
  tools,
}) => {
  const { delete: deleteRange } = useCommands();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  return (
    <Paper
      elevation={1}
      onMouseDown={(e) => {
        let node: EventTarget | Element | null = e.target;
        while (node) {
          if (!(node instanceof Element)) {
            break;
          }

          if (node.getAttribute('data-button-type') === 'dnd') {
            return;
          }

          node = node.parentElement;
        }

        e.preventDefault();
      }}
    >
      <Box alignItems="center" display="flex" justifyContent="space-between">
        <Box alignItems="center" display="flex" paddingRight={2}>
          <Box display="flex" flexDirection="column">
            <MoveUpButton />
            <MoveDownButton />
          </Box>
          <DragHandle
            blockIndex={blockIndex}
            onDragEnd={onDragEnd}
            onDragStart={onDragStart}
          />
          <Box alignItems="center" display="flex" gap={1} marginX={0.5}>
            {icon}
            <Typography fontSize="14px">{title}</Typography>
          </Box>
        </Box>
        <Box alignItems="center" display="flex">
          {tools}
          <IconButton onClick={(ev) => setAnchorEl(ev.currentTarget)}>
            <MoreVert />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            onClose={() => setAnchorEl(null)}
            open={!!anchorEl}
            slotProps={{
              root: {
                disablePortal: true,
              },
            }}
          >
            <MenuItem key="delete" onClick={() => deleteRange(range)}>
              <Msg id={messageIds.editor.toolbar.delete} />
            </MenuItem>
            {conversions &&
              conversions.map((conversion) => (
                <MenuItem
                  key={conversion.label}
                  onClick={() => {
                    conversion.onClick();
                    setAnchorEl(null);
                  }}
                >
                  {conversion.label}
                </MenuItem>
              ))}
          </Menu>
        </Box>
      </Box>
    </Paper>
  );
};

export default BlockToolbarBase;
