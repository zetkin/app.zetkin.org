import { FC } from 'react';
import { makeStyles } from '@mui/styles';
import { Box, Theme, Typography } from '@mui/material';

interface StyleProps {
  color: string;
}

const useStyles = makeStyles<Theme, StyleProps>(() => ({
  number: {
    bottom: 3,
    color: ({ color }) => color,
    left: 2,
    position: 'absolute',
    right: 5,
    textAlign: 'center',
  },
  parent: {
    height: 41,
    position: 'relative',
    width: 28,
  },
}));

interface BasicMarkerProps {
  color: string;
  events: number;
}

const BasicMarker: FC<BasicMarkerProps> = ({ color, events }) => {
  const classes = useStyles({ color });
  return (
    <Box className={classes.parent}>
      {events > 0 && (
        <Box className={classes.number}>
          <Typography>{events > 9 ? '9+' : events}</Typography>
        </Box>
      )}
      <svg
        fill="none"
        height="40"
        style={{
          transform: 'translate(-14px, -44px)',
        }}
        viewBox="0 0 31 40"
        width="27"
      >
        <path
          d="M14 38.479C13.6358 38.0533 13.1535 37.4795
           12.589 36.7839C11.2893 35.1826 9.55816 32.9411
            7.82896 30.3782C6.09785 27.8124 4.38106 24.9426
            3.1001 22.0833C1.81327 19.211 1 16.4227 1 14C1
            6.81228 6.81228 1 14 1C21.1877 1 27 6.81228 27 14C27
            16.4227 26.1867 19.211 24.8999 22.0833C23.6189 24.9426
            21.9022 27.8124 20.171 30.3782C18.4418 32.9411 16.7107
            35.1826 15.411 36.7839C14.8465 37.4795 14.3642
            38.0533 14 38.479Z"
          fill="white"
          stroke="#ED1C55"
          strokeWidth="2"
        />
      </svg>
    </Box>
  );
};

export default BasicMarker;
