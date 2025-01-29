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
import { Msg } from 'core/i18n';
import messageIds from 'zui/l10n/messageIds';

type BlockToolbarBaseProps = {
  conversions?: { label: string; onClick: () => void }[];
  curBlockY: number;
  icon: JSX.Element;
  range: FromToProps;
  title: string;
  tools?: JSX.Element;
};

const BlockToolbarBase: FC<BlockToolbarBaseProps> = ({
  conversions,
  curBlockY,
  icon,
  range,
  title,
  tools,
}) => {
  const { delete: deleteRange } = useCommands();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  return (
    <Box position="relative">
      <Box
        minWidth={280}
        sx={{
          left: 5,
          position: 'absolute',
          top: curBlockY - 60,
          transition: 'opacity 0.5s',
          zIndex: 900,
        }}
      >
        <Paper elevation={1}>
          <Box
            alignItems="center"
            display="flex"
            justifyContent="space-between"
          >
            <Box alignItems="center" display="flex" paddingRight={2}>
              <Box display="flex" flexDirection="column">
                <MoveUpButton />
                <MoveDownButton />
              </Box>
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
      </Box>
    </Box>
  );
};

export default BlockToolbarBase;
