import { ArrowBackIos } from '@mui/icons-material';
import { Box, IconButton, Typography } from '@mui/material';
import { FC, ReactNode } from 'react';

type Props = {
  color?: string | null;
  iconButtons: ReactNode;
  onBack?: () => void;
  subtitle?: string | ReactNode;
  title: string;
};

const PageBaseHeader: FC<Props> = ({
  color,
  iconButtons,
  onBack,
  subtitle,
  title,
}) => {
  return (
    <Box display="flex" justifyContent="space-between" width="100%">
      {color && <Box bgcolor={color} height={40} width={40} />}
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
