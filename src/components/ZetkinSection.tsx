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
    <Box height={1} width={1}>
      <Box
        alignItems="center"
        display="flex"
        justifyContent="space-between"
        mb={2}
      >
        <Typography color="secondary" component="h2" variant="h6">
          {title}
        </Typography>
        {action}
      </Box>
      {children}
    </Box>
  );
};

export default ZetkinSection;
