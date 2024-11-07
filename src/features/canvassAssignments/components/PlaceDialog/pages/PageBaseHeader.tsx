import { ArrowBackIos } from '@mui/icons-material';
import { Box, IconButton, Typography } from '@mui/material';
import { FC, ReactNode } from 'react';

type Props = {
  iconButtons: ReactNode;
  onBack?: () => void;
  subtitle?: string;
  title: string;
};

const PageBaseHeader: FC<Props> = ({
  iconButtons,
  onBack,
  subtitle,
  title,
}) => {
  return (
    <Box display="flex" justifyContent="space-between" width="100%">
      <Box alignItems="center" display="flex">
        {onBack && (
          <IconButton onClick={() => onBack()}>
            <ArrowBackIos />
          </IconButton>
        )}
        <Box>
          <Typography variant="h6">{title}</Typography>
          {subtitle && (
            <Typography color="secondary" variant="body2">
              {subtitle}
            </Typography>
          )}
        </Box>
      </Box>
      <Box>{iconButtons}</Box>
    </Box>
  );
};

export default PageBaseHeader;
