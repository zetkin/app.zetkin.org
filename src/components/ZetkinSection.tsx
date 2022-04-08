import { FunctionComponent } from 'react';
import { Box, Typography } from '@material-ui/core';

interface ZetkinSectionProps {
  title: string;
  action?: React.ReactNode | Element;
}

const ZetkinSection: FunctionComponent<ZetkinSectionProps> = ({
  children,
  title,
  action,
}) => {
  return (
    <Box>
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

export default ZetkinSection;
