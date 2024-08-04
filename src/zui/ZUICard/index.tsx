import { Box, Card, Typography } from '@mui/material';
import { FC, ReactNode } from 'react';

type ZUICardProps = {
  children?: ReactNode;
  header: string | JSX.Element;
  status?: ReactNode;
  subheader?: string;
};

const ZUICard: FC<ZUICardProps> = ({ children, header, status, subheader }) => {
  return (
    <Card>
      <Box display="flex" justifyContent="space-between" m={2}>
        <Box>
          <Typography variant="h5">{header}</Typography>
          {subheader && (
            <Typography color="GrayText" variant="body2">
              {subheader}
            </Typography>
          )}
        </Box>
        <Box>{status}</Box>
      </Box>
      <Box m={2}>{children}</Box>
    </Card>
  );
};

export default ZUICard;
