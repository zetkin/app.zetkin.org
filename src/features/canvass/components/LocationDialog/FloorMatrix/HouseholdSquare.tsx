import { Check, Close } from '@mui/icons-material';
import { Box } from '@mui/material';
import { FC } from 'react';

import { GRID_SQUARE } from './constants';

type Props = {
  active: boolean;
  color?: 'clear' | string | null;
  content?: 'check' | 'cross' | number | null;
};

const HouseholdSquare: FC<Props> = ({ active, color, content }) => {
  const isCheck = content == 'check';
  const isCross = content == 'cross';
  const isLiteral = !isCheck && !isCross;

  color = color == 'clear' ? null : color;
  const backgroundColor = active ? 'black' : '#bbb';

  return (
    <Box
      sx={{
        alignItems: 'center',
        backgroundColor: backgroundColor,
        borderRadius: 1,
        borderTopColor: color || backgroundColor,
        borderTopStyle: 'solid',
        borderTopWidth: 8,
        color: 'white',
        display: 'flex',
        flexGrow: 0,
        flexShrink: 0,
        height: GRID_SQUARE,
        justifyContent: 'center',
        margin: 0,
        width: GRID_SQUARE,
      }}
    >
      {isCheck && <Check />}
      {isCross && <Close />}
      {isLiteral && content}
    </Box>
  );
};

export default HouseholdSquare;
