import {
  Box,
  IconButton,
  Paper,
  SvgIconTypeMap,
  Typography,
} from '@mui/material';
import { useCommands } from '@remirror/react';
import { FC } from 'react';
import { Delete } from '@mui/icons-material';
import { FromToProps } from 'remirror';
import { OverridableComponent } from '@mui/material/OverridableComponent';

import MoveUpButton from './buttons/MoveUpButton';
import MoveDownButton from './buttons/MoveDownButton';

type BlockToolbarProps = {
  curBlockY: number;
  icon: OverridableComponent<SvgIconTypeMap<Record<string, unknown>, 'svg'>>;
  range: FromToProps;
  title: string;
  tools: JSX.Element;
};

const BlockToolbar: FC<BlockToolbarProps> = ({
  curBlockY,
  icon: Icon,
  range,
  title,
  tools,
}) => {
  const { delete: deleteRange } = useCommands();

  return (
    <Box position="relative">
      <Box
        sx={{
          left: 0,
          position: 'absolute',
          top: curBlockY - 50,
          transition: 'opacity 0.5s',
          zIndex: 10000,
        }}
      >
        <Paper elevation={1}>
          <Box alignItems="center" display="flex" padding={1}>
            <Box display="flex" flexDirection="column">
              <MoveUpButton />
              <MoveDownButton />
            </Box>
            <Icon color="secondary" />
            <Typography padding={1}>{title}</Typography>
            {tools}
            <IconButton onClick={() => deleteRange(range)}>
              <Delete />
            </IconButton>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default BlockToolbar;
