import { Box, SxProps } from '@mui/material';
import { FC, useEffect } from 'react';

import oldTheme from 'theme';

type Props = {
  duration?: number;
  onComplete?: () => void;
};

const EncouragingSparkle: FC<Props> = ({ duration = 2000, onComplete }) => {
  useEffect(() => {
    setTimeout(() => onComplete?.(), duration);
  }, []);

  const particleSx: SxProps = {
    '@keyframes hover': {
      '0%': {
        transform: 'translateX(-7px)',
      },
      '33%': {
        transform: 'translate(-5px, -5px) rotate(30deg)',
      },
      '66%': {
        transform: 'translate(5px, 8px) rotate(-40deg)',
      },
      '99%': {
        transform: 'translateX(6px)',
      },
    },
    animationDirection: 'alternate',
    animationDuration: `${duration}ms`,
    animationIterationCount: 'infinite',
    animationName: 'hover',
    backgroundColor: oldTheme.palette.primary.main,
    borderRadius: 5,
    height: 10,
    position: 'fixed',
    width: 10,
    zIndex: 9999999,
  };

  return (
    <Box
      sx={{
        '@keyframes flyToMenu': {
          '0%': {
            left: '50vw',
            opacity: 0,
            top: 'calc(100vh - 2rem)',
            transform: 'translateX(-30px)',
          },
          '20%': {
            opacity: 0.8,
            transform: 'translateX(30px)',
          },
          '40%': {
            transform: 'translateX(-30px)',
          },
          '60%': {
            transform: 'translateX(30px)',
          },
          '75%': {
            left: '90vw',
            opacity: 0.8,
            top: '2rem',
            transform: 'translateX(0px)',
          },
          '90%': {
            opacity: 0.9,
            transform: 'rotate(90deg) scale(2.5, 2.5)',
          },
          '99%': {
            left: '105vw',
            opacity: 0,
            top: '2rem',
            transform: 'rotate(180deg) scale(0, 0)',
          },
        },
        animationDirection: 'normal',
        animationDuration: `${duration}ms`,
        animationIterationCount: 1,
        animationName: 'flyToMenu',
        animationTimingFunction: 'easeInOut',
        backgroundColor: oldTheme.palette.primary.main,
        borderRadius: 5,
        height: 10,
        position: 'fixed',
        width: 10,
        zIndex: 9999999,
      }}
    >
      <Box sx={{ opacity: 0.4, transform: `rotate(${Math.random() * 50}deg)` }}>
        <Box sx={particleSx} />
      </Box>
      <Box
        sx={{
          opacity: 0.2,
          transform: `rotate(${120 + Math.random() * 70}deg)`,
        }}
      >
        <Box sx={particleSx} />
      </Box>
    </Box>
  );
};

export default EncouragingSparkle;
