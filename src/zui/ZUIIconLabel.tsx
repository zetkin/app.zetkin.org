import { FC } from 'react';
import { Box, Typography } from '@mui/material';

export interface ZUIIconLabelProps {
  icon: JSX.Element;
  label: string;
}

const ZUIIconLabel: FC<ZUIIconLabelProps> = ({ icon, label }) => {
  return (
    <Box display="flex" gap={1}>
      {icon}
      <Typography>{label}</Typography>
    </Box>
  );
};

export default ZUIIconLabel;
