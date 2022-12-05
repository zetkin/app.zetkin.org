import { FunctionComponent } from 'react';
import { Box, Typography } from '@mui/material';

interface ZUISectionProps {
  children: React.ReactNode;
  title: string;
  action?: React.ReactNode;
}

const ZUISection: FunctionComponent<ZUISectionProps> = ({
  children,
  title,
  action,
  ...restProps
}) => {
  return (
    <Box {...restProps}>
      <Box
        alignItems="center"
        display="flex"
        justifyContent="space-between"
        mb={2}
        minHeight={38}
      >
        <Typography color="secondary" component="h2" variant="h6">
          {title}
        </Typography>
        {action && <Box>{action}</Box>}
      </Box>
      {children}
    </Box>
  );
};

export default ZUISection;
