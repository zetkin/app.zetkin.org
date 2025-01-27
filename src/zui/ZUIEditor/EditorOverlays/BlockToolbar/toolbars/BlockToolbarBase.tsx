import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Typography,
} from '@mui/material';
import { FC, useState } from 'react';
import { FromToProps } from 'remirror';
import { Delete, KeyboardArrowDown } from '@mui/icons-material';
import { useCommands } from '@remirror/react';

import MoveUpButton from '../buttons/MoveUpButton';
import MoveDownButton from '../buttons/MoveDownButton';

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
          left: 0,
          position: 'absolute',
          top: curBlockY - 50,
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
            <Box alignItems="center" display="flex">
              <Box display="flex" flexDirection="column">
                <MoveUpButton />
                <MoveDownButton />
              </Box>
              {!conversions && (
                <Box alignItems="center" display="flex" gap={1} marginX={0.5}>
                  {icon}
                  <Typography fontSize="14px">
                    {title.toLocaleUpperCase()}
                  </Typography>
                </Box>
              )}
              {conversions && (
                <>
                  <Button
                    endIcon={<KeyboardArrowDown />}
                    onClick={(ev) =>
                      setAnchorEl(anchorEl ? null : ev.currentTarget)
                    }
                    startIcon={icon}
                  >
                    {title}
                  </Button>
                  <Menu
                    anchorEl={anchorEl}
                    onClose={() => setAnchorEl(null)}
                    open={!!anchorEl}
                  >
                    {conversions.map((conversion) => (
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
                </>
              )}
            </Box>
            <Box alignItems="center" display="flex">
              {tools}
              <IconButton onClick={() => deleteRange(range)}>
                <Delete />
              </IconButton>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default BlockToolbarBase;
