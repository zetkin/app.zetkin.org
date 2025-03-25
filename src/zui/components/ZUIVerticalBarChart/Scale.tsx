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
        className="scale"
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
          className="numbers"
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
          className="lines"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <Box
            className="line"
            sx={{
              backgroundColor: 'currentColor',
              height: '1px',
              width: '0.25rem',
            }}
          />
          <Box
            className="line"
            sx={{
              backgroundColor: 'currentColor',
              height: '1px',
              width: '0.25rem',
            }}
          />
          <Box
            className="line"
            sx={{
              backgroundColor: 'currentColor',
              height: '1px',
              width: '0.25rem',
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Scale;
