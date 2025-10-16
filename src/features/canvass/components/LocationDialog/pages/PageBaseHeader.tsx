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
  const subtitleIsAString = subtitle && typeof subtitle == 'string';

  return (
    <Box
      sx={{
        display: 'flex',
        paddingBottom: 1,
        paddingX: 2,
        position: 'relative',
      }}
    >
      <Box display="flex" justifyContent="space-between" width="100%">
        <Box alignItems="center" display="flex">
          {onBack && (
            <IconButton onClick={() => onBack()}>
              <ArrowBackIos />
            </IconButton>
          )}
          <Box>
            <Typography variant="h6">{title}</Typography>
            {!subtitleIsAString && subtitle}
            {subtitleIsAString && (
              <Box sx={{ alignItems: 'center', display: 'flex', gap: 1 }}>
                {color && (
                  <Box
                    sx={{
                      backgroundColor: color,
                      borderRadius: '3em',
                      height: '20px',
                      width: '20px',
                    }}
                  />
                )}
                {subtitle && (
                  <Typography color="secondary" variant="body2">
                    {subtitle}
                  </Typography>
                )}
              </Box>
            )}
          </Box>
        </Box>
        <Box>{iconButtons}</Box>
      </Box>
    </Box>
  );
};

export default PageBaseHeader;
