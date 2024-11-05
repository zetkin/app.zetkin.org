import { createTheme } from '@mui/material';

import './types';
import palette from './palette';
import typography from './typography';

const theme = createTheme({
  elevation: {
    bottom: {
      big: {
        light: '0rem 0.25rem 2.5rem 0rem #00000014',
        medium: '0rem 0.25rem 2.5rem 0rem #0000001F',
      },
      small: {
        light: '0rem 0.25rem 1.25rem 0rem #00000014',
        medium: '0rem 0.25rem 1.25rem 0rem #0000001F',
      },
    },
    top: {
      big: {
        light: '0.rem -0.25rem 2.25rem 0rem #00000014',
        medium: '0rem -0.25rem 2.25rem 0rem #0000001F',
      },
      small: {
        light: '0rem -0.25rem 1.25rem 0rem #00000014',
        medium: '0rem -0.25rem 1.25rem 0rem #0000001F',
      },
    },
  },
  palette: palette,
  typography: typography,
});

export default theme;
