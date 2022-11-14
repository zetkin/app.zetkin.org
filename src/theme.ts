import { createElement } from 'react';
import { createTheme } from '@material-ui/core/styles';

interface PaletteIntensityOptions {
  disabled?: string;
  high?: string;
  medium?: string;
  main?: string;
}

declare module '@material-ui/core/styles/createPalette' {
  interface Palette {
    onSurface: PaletteIntensityOptions;
    outline: PaletteIntensityOptions;
  }
  interface PaletteOptions {
    onSurface: PaletteIntensityOptions;
    outline: PaletteIntensityOptions;
  }
}

const themePalette = {
  background: {
    default: '#F9F9F9',
  },
  error: {
    main: '#EE323E',
  },
  info: {
    main: '#3598c5',
  },
  onSurface: {
    disabled: '#231F2061',
    high: '#231F20DE',
    medium: '#231F2099',
  },
  outline: {
    main: 'rgba(0,0,0,0.12)',
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
  targetingStatusBar: {
    blue: 'rgba(25, 118, 210, 1)',
    gray: 'rgba(0, 0, 0, 0.12)',
    green: 'rgba(102, 187, 106, 1)',
    orange: 'rgba(245, 124, 0, 1)',
  },
  text: {
    secondary: 'rgba(0, 0, 0, 0.6)',
  },
  warning: {
    main: '#ee8432',
  },
};

// Create a theme instance.
const theme = createTheme({
  overrides: {
    MuiButton: {
      label: {
        textTransform: 'uppercase',
      },
      root: {
        minWidth: '1rem',
        textTransform: 'none',
      },
    },
    // Note: MUI issue - MuiDataGrid is missing from MUI overrides
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    MuiDataGrid: {
      root: {
        '& .MuiDataGrid-cell': {
          fontSize: 16,
        },
        '& .MuiDataGrid-columnHeaderTitle': {
          color: themePalette.onSurface.medium,
          fontWeight: 'bold',
        },
        '& [role="toolbar"]': {
          '& > *': {
            margin: '0 4px',
            marginRight: 15,
            marginTop: 5,
          },
          display: 'flex',
          justifyContent: 'flex-end',
        },
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
  palette: themePalette,
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
      fontSize: '2.5rem',
      fontWeight: 400,
    },
    h5: {
      fontSize: '1.1rem',
      fontWeight: 500,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
    },
    subtitle2: {
      fontWeight: 600,
    },
  },
});

export default theme;
