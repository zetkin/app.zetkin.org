import { FC } from 'react';
import { Box, Typography } from '@mui/material';

export interface ZUIIconLabelProps {
  icon: JSX.Element;
  label: string | JSX.Element;
  color?: 'error' | 'secondary';
  size?: 'sm' | 'md' | 'xs';
}

const FONT_SIZES = {
  md: '1.1em',
  sm: '1em',
  xs: '0.7em',
} as const;

const ZUIIconLabel: FC<ZUIIconLabelProps> = ({
  icon,
  label,
  color,
  size = 'md',
}) => {
  return (
    <Box
      alignItems="center"
      color={color}
      display="flex"
      flexShrink="0"
      fontSize={FONT_SIZES[size]}
      gap={1}
    >
      {icon}
      <Typography
        color={color ? color : 'inherit'}
        flexShrink="0"
        fontSize="inherit"
      >
        {label}
      </Typography>
    </Box>
  );
};

export default ZUIIconLabel;
