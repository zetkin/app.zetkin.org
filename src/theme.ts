import type {} from '@mui/x-data-grid-pro/themeAugmentation';
import { createElement } from 'react';
import { createTheme } from '@mui/material/styles';
import { Localization } from '@mui/x-data-grid/utils/getGridLocalization';
import { daDK, deDE, nbNO, svSE } from '@mui/x-data-grid-pro';

import { oldThemePalette } from 'oldThemePalette';

// Create a theme instance.
const theme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          minWidth: '1rem',
          textTransform: 'uppercase',
        },
      },
    },
    MuiCard: {
      defaultProps: {
        variant: 'outlined',
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          '& .MuiDataGrid-cell': {
            fontSize: 16,
          },
          '& .MuiDataGrid-columnHeaderTitle': {
            color: oldThemePalette.onSurface.medium,
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
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          minWidth: 120,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
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
    },
    MuiSnackbar: {
      defaultProps: {
        anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
        autoHideDuration: 3000,
      },
    },
    MuiTabs: {
      defaultProps: {
        TabIndicatorProps: {
          children: createElement('span'),
        },
        indicatorColor: 'primary',
        textColor: 'primary',
      },
      styleOverrides: {
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
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontSize: '14px',
        },
      },
    },
  },
  palette: oldThemePalette,
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

const locales: Record<string, Localization> = {};
locales['da'] = daDK;
locales['de'] = deDE;
locales['nn'] = nbNO;
locales['sv'] = svSE;

export const oldThemeWithLocale = (lang: string) => {
  return createTheme(theme, locales[lang]);
};

export default theme;
