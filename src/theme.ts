import { createElement } from 'react';
import { createTheme } from '@material-ui/core/styles';

// Create a theme instance.
const theme = createTheme({
  overrides: {
    MuiButton: {
      root: {
        minWidth: '1rem',
        textTransform: 'none',
      },
    },
    MuiFormControl: {
      root: {
        minWidth: 120,
      },
    },
    MuiIconButton: {
      colorPrimary: {
        '&:hover': {
          backgroundColor: 'transparent',
        },
      },
      colorSecondary: {
        '&:hover': {
          backgroundColor: 'transparent',
        },
      },
      root: {
        '&:hover': {
          backgroundColor: 'transparent',
          color: '#ED1C55',
        },
      },
    },
    MuiTabs: {
      indicator: {
        '& > span': {
          backgroundColor: '#ED1C55',
          maxWidth: 100,
          width: '100%',
        },
        backgroundColor: 'transparent',
        display: 'flex',
        justifyContent: 'center',
      },
      root: {
        borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
      },
    },
    MuiTooltip: {
      tooltip: {
        fontSize: '14px',
      },
    },
  },
  palette: {
    background: {
      default: '#F9F9F9',
    },
    error: {
      main: '#EE323E',
    },
    info: {
      main: '#3598c5',
    },
    primary: {
      main: '#ED1C55',
    },
    secondary: {
      main: 'rgba(0, 0, 0, 0.6)',
    },
    success: {
      main: '#0eae4e',
    },
    text: {
      secondary: 'rgba(0, 0, 0, 0.6)',
    },
    warning: {
      main: '#ee8432',
    },
  },
  props: {
    MuiCard: {
      variant: 'outlined',
    },
    MuiSnackbar: {
      anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
      autoHideDuration: 3000,
    },
    MuiTabs: {
      TabIndicatorProps: {
        children: createElement('span'),
      },
      indicatorColor: 'primary',
      textColor: 'primary',
    },
  },
  typography: {
    fontFamily: 'azo-sans-web, sans-serif',
    h2: {
      lineHeight: 'unset',
    },
    h3: {
      fontWeight: 'lighter',
    },
  },
});

export default theme;
