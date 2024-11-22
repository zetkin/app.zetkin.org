import { Add, Remove } from '@mui/icons-material';
import { Box, IconButton, Typography } from '@mui/material';
import { FC } from 'react';

const Stepper: FC<{
  label: string;
  onChange: (value: number) => void;
  value: number;
}> = ({ label, onChange, value }) => {
  return (
    <Box alignItems="center" display="flex" flexDirection="column">
      <Typography color="secondary">{label}</Typography>
      <Box alignItems="center" display="flex">
        <IconButton onClick={() => onChange(value - 1)}>
          <Remove />
        </IconButton>
        <Typography minWidth={40} textAlign="center">
          {value}
        </Typography>
        <IconButton onClick={() => onChange(value + 1)}>
          <Add />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Stepper;
