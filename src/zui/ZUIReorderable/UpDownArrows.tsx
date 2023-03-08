import { FC } from 'react';
import { Box, IconButton } from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';

type UpDownArrowProps = {
  onClickDown: () => void;
  onClickUp: () => void;
  showDown: boolean;
  showUp: boolean;
};

const UpDownArrows: FC<UpDownArrowProps> = ({
  onClickDown,
  onClickUp,
  showDown,
  showUp,
}) => {
  return (
    <Box display="flex" flexDirection="column">
      {showUp && (
        <IconButton onClick={() => onClickUp()}>
          <KeyboardArrowUp />
        </IconButton>
      )}
      {showDown && (
        <IconButton onClick={() => onClickDown()}>
          <KeyboardArrowDown />
        </IconButton>
      )}
    </Box>
  );
};

export default UpDownArrows;
