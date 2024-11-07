import { ArrowBackIos } from '@mui/icons-material';
import { Box, IconButton, Typography } from '@mui/material';
import { FC, ReactNode } from 'react';

type Props = {
  iconButtons: ReactNode;
  onBack?: () => void;
  title: string;
};

const PageBaseHeader: FC<Props> = ({ iconButtons, onBack, title }) => {
  return (
    <Box display="flex" justifyContent="space-between" width="100%">
      <Box alignItems="center" display="flex">
        {onBack && (
          <IconButton onClick={() => onBack()}>
            <ArrowBackIos />
          </IconButton>
        )}
        <Typography variant="h6">{title}</Typography>
      </Box>
      <Box>{iconButtons}</Box>
    </Box>
  );
};

export default PageBaseHeader;
