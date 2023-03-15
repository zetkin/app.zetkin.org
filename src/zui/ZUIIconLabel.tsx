import { FC } from 'react';
import { Box, Typography } from '@mui/material';

export interface ZUIIconLabelProps {
  icon: JSX.Element;
  label: string | JSX.Element;
  labelColor?: string;
}

const ZUIIconLabel: FC<ZUIIconLabelProps> = ({ icon, label, labelColor }) => {
  return (
    <Box display="flex" gap={1}>
      {icon}
      <Typography color={labelColor ? labelColor : 'inherit'}>
        {label}
      </Typography>
    </Box>
  );
};

export default ZUIIconLabel;
