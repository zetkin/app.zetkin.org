import { Add, Remove } from '@mui/icons-material';
import { Box, IconButton, Typography } from '@mui/material';
import { FC } from 'react';

const IntInput: FC<{
  label: string;
  labelPlacement?: 'horizontal' | 'vertical';
  max?: number;
  min?: number;
  onChange: (value: number) => void;
  value: number;
}> = ({
  label,
  labelPlacement = 'vertical',
  max = Number.MAX_SAFE_INTEGER,
  min = Number.MIN_SAFE_INTEGER,
  onChange,
  value,
}) => {
  const vertical = labelPlacement == 'vertical';

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
          disabled={value <= min}
          onClick={() => value > min && onChange(value - 1)}
        >
          <Remove />
        </IconButton>
        <Typography minWidth={40} textAlign="center">
          {value}
        </Typography>
        <IconButton
          disabled={value >= max}
          onClick={() => value < max && onChange(value + 1)}
        >
          <Add />
        </IconButton>
      </Box>
    </Box>
  );
};

export default IntInput;
