import { Box, Typography } from '@mui/material';
import { FC } from 'react';

type ScaleProps = {
  maxValue: number;
};

const Scale: FC<ScaleProps> = ({ maxValue }) => {
  const minValue = 0;

  return (
    <Box aria-hidden="true">
      <Box
        sx={{
          color: 'text.secondary',
          display: 'flex',
          gap: '0.25rem',
          height: '100%',
          justifyContent: 'space-between',
          marginInlineStart: '20%',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            textAlign: 'right',
          }}
        >
          <Typography
            sx={{
              translate: '0 -50%',
            }}
            variant="labelSmMedium"
          >
            {maxValue}
          </Typography>
          <Typography
            sx={{
              translate: '0 50%',
            }}
            variant="labelSmMedium"
          >
            {minValue}
          </Typography>
        </Box>
        <Box
          sx={{
            '.line': {
              backgroundColor: 'currentColor',
              height: '1px',
              width: '0.25rem',
            },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <Box className="line" />
          <Box className="line" />
          <Box className="line" />
        </Box>
      </Box>
    </Box>
  );
};

export default Scale;
