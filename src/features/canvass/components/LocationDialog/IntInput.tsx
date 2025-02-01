import { Add, Remove } from '@mui/icons-material';
import { Box, IconButton, Typography } from '@mui/material';
import { FC } from 'react';

const IntInput: FC<{
  label: string;
  labelPlacement?: 'horizontal' | 'vertical';
  maxInt?: number;
  minInt?: number;
  onChange: (value: number) => void;
  value: number;
}> = ({
  label,
  labelPlacement = 'vertical',
  maxInt,
  minInt,
  onChange,
  value,
}) => {
  const vertical = labelPlacement == 'vertical';
  if (minInt == undefined) {
    minInt = Number.MIN_SAFE_INTEGER;
  }
  if (maxInt == undefined) {
    maxInt = Number.MAX_SAFE_INTEGER;
  }
  return (
    <Box
      alignItems="center"
      display="flex"
      flexDirection={vertical ? 'column' : 'row'}
      justifyContent="space-between"
    >
      <Typography color="secondary">{label}</Typography>
      <Box alignItems="center" display="flex">
        <IconButton
          disabled={value <= minInt}
          onClick={() => value > minInt && onChange(value - 1)}
        >
          <Remove />
        </IconButton>
        <Typography minWidth={40} textAlign="center">
          {value}
        </Typography>
        <IconButton
          disabled={value >= maxInt}
          onClick={() => value < maxInt && onChange(value + 1)}
        >
          <Add />
        </IconButton>
      </Box>
    </Box>
  );
};

export default IntInput;
