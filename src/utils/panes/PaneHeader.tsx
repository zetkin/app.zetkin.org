import { Box, Typography } from '@mui/material';
import { FC, ReactNode } from 'react';

interface PaneHeaderProps {
  title: string;
  subtitle?: ReactNode;
}

const PaneHeader: FC<PaneHeaderProps> = ({ title, subtitle }) => {
  return (
    <Box marginBottom={2} marginRight={2}>
      <Typography fontSize={30} variant="h3">
        {title}
      </Typography>
      <Box display="flex" justifyContent="space-between">
        {subtitle}
      </Box>
    </Box>
  );
};

export default PaneHeader;
