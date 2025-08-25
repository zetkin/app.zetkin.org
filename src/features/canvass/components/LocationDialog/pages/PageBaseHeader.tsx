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
    <Box
      sx={{
        display: 'flex',
        height: '54px',
        paddingBottom: 1,
        paddingX: 2,
        position: 'relative',
      }}
    >
      {color && (
        <Box
          sx={{
            backgroundColor: color,
            height: '70px',
            left: -16,
            position: 'absolute',
            top: -16,
            width: '32px',
          }}
        />
      )}
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
    </Box>
  );
};

export default PageBaseHeader;
