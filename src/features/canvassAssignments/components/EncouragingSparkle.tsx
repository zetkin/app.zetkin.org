import { Box, Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { FC, useEffect } from 'react';

type StyleProps = {
  duration: number;
};

const useStyles = makeStyles<Theme, StyleProps>((theme) => ({
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
  particle: {
    animationDirection: 'alternate',
    animationDuration: ({ duration }) => duration + 'ms',
    animationIterationCount: 'infinite',
    animationName: '$hover',
    backgroundColor: theme.palette.primary.main,
    borderRadius: 5,
    height: 10,
    position: 'fixed',
    width: 10,
    zIndex: 9999999,
  },
  system: {
    animationDirection: 'normal',
    animationDuration: ({ duration }) => duration + 'ms',
    animationIterationCount: 1,
    animationName: '$flyToMenu',
    animationTimingFunction: 'easeInOut',
    backgroundColor: theme.palette.primary.main,
    borderRadius: 5,
    height: 10,
    position: 'fixed',
    width: 10,
    zIndex: 9999999,
  },
}));

type Props = {
  duration?: number;
  onComplete?: () => void;
};

const EncouragingSparkle: FC<Props> = ({ duration = 2000, onComplete }) => {
  const classes = useStyles({ duration });
  useEffect(() => {
    setTimeout(() => onComplete?.(), duration);
  }, []);
  return (
    <Box className={classes.system}>
      <Box sx={{ opacity: 0.4, transform: `rotate(${Math.random() * 50}deg)` }}>
        <Box className={classes.particle} />
      </Box>
      <Box
        sx={{
          opacity: 0.2,
          transform: `rotate(${120 + Math.random() * 70}deg)`,
        }}
      >
        <Box className={classes.particle} />
      </Box>
    </Box>
  );
};

export default EncouragingSparkle;
