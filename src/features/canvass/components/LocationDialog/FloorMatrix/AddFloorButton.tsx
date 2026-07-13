import { Box, Typography, useTheme } from '@mui/material';
import { Add } from '@mui/icons-material';
import { FC } from 'react';

import { GRID_GAP, GRID_SQUARE } from './constants';

type Props = {
  label: string;
  nextLevel: number;
  onClick: () => void;
};

const AddFloorButton: FC<Props> = ({ label, nextLevel, onClick }) => {
  const theme = useTheme();
  const color = theme.palette.grey[500];

  return (
    <Box
      onClick={() => onClick()}
      sx={{
        alignItems: 'center',
        display: 'flex',
        gap: GRID_GAP + 'px',
        ml: GRID_SQUARE + 'px',
        my: GRID_GAP + 'px',
      }}
    >
      <Box
        sx={{
          alignItems: 'center',
          borderColor: color,
          borderRadius: 1,
          borderStyle: 'solid',
          borderWidth: '1px',
          color: color,
          display: 'flex',
          flexShrink: 0,
          height: GRID_SQUARE,
          justifyContent: 'center',
          width: GRID_SQUARE,
        }}
      >
        {nextLevel}
      </Box>
      <Box
        sx={{
          color: color,
          flexGrow: 1,
          p: 1,
        }}
      >
        <Typography variant="body2">{label}</Typography>
      </Box>
      <Box sx={{ color: color, mr: 1 }}>
        <Add />
      </Box>
    </Box>
  );
};

export default AddFloorButton;
