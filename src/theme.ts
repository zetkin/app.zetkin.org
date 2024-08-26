import type {} from '@mui/x-data-grid-pro/themeAugmentation';
import { createElement } from 'react';
import { createTheme } from '@mui/material/styles';
import { Figtree } from 'next/font/google';
import { Localization } from '@mui/x-data-grid/utils/getGridLocalization';
import { daDK, deDE, nbNO, svSE } from '@mui/x-data-grid-pro';

//Font family
const figtree = Figtree({ subsets: ['latin-ext'] });

interface PaletteIntensityOptions {
  disabled?: string;
  high?: string;
  medium?: string;
  main?: string;
}

interface FilterCategoryColors {
  pale: string;
  strong: string;
}

// Update the Typography's variant prop options
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    //TO-DO: set these to 'false' once the old theme is removed
    h1: true;
    h3: true;
    h2: true;
    h4: true;
    h5: true;
    h6: true;
    subtitle1: true;
    subtitle2: true;
    body1: true;
    body2: true;
    caption: true;
    button: true;
    overline: true;
    //Keep these as true for the new theme
    headingLg: true;
    headingMd: true;
    headingSm: true;
    bodyMdBold: true;
    bodyMdRegular: true;
    bodySmBold: true;
    bodySmRegular: true;
    linkMd: true;
    linkSm: true;
    labelMdMedium: true;
    labelMdRegular: true;
  }
}

declare module '@mui/material/styles' {
  interface Theme {
    elevation: {
      bottom: {
        big: {
          light: string;
          medium: string;
        };
        small: {
          light: string;
          medium: string;
        };
      };
      top: {
        big: {
          light: string;
          medium: string;
        };
        small: {
          light: string;
          medium: string;
        };
      };
    };
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    elevation?: {
      bottom?: {
        big?: {
          light?: string;
          medium?: string;
        };
        small?: {
          light?: string;
          medium?: string;
        };
      };
      top?: {
        big?: {
          light?: string;
          medium?: string;
        };
        small?: {
          light?: string;
          medium?: string;
        };
      };
    };
  }

  interface TypographyVariants {
    headingLg: React.CSSProperties;
    headingMd: React.CSSProperties;
    headingSm: React.CSSProperties;
    bodyMdBold: React.CSSProperties;
    bodyMdRegular: React.CSSProperties;
    bodySmBold: React.CSSProperties;
    bodySmRegular: React.CSSProperties;
    linkMd: React.CSSProperties;
    linkSm: React.CSSProperties;
    labelMdMedium: React.CSSProperties;
    labelMdRegular: React.CSSProperties;
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    headingLg?: React.CSSProperties;
    headingMd?: React.CSSProperties;
    headingSm?: React.CSSProperties;
    bodyMdBold?: React.CSSProperties;
    bodyMdRegular?: React.CSSProperties;
    bodySmBold?: React.CSSProperties;
    bodySmRegular?: React.CSSProperties;
    linkMd?: React.CSSProperties;
    linkSm?: React.CSSProperties;
    labelMdMedium?: React.CSSProperties;
    labelMdRegular?: React.CSSProperties;
  }
}

declare module '@mui/material/styles/createPalette' {
  interface Palette {
    onSurface: Required<PaletteIntensityOptions>;
    outline: PaletteIntensityOptions;
    filterCategoryColors: {
      darkBlue: FilterCategoryColors;
      green: FilterCategoryColors;
      lightBlue: FilterCategoryColors;
      orange: FilterCategoryColors;
      pink: FilterCategoryColors;
      purple: FilterCategoryColors;
      red: FilterCategoryColors;
      teal: FilterCategoryColors;
      yellow: FilterCategoryColors;
    };
    activityStatusColors: {
      cancelled: string;
      closed: string;
      draft: string;
      ended: string;
      published: string;
      scheduled: string;
    };
    statusColors: {
      blue: string;
      gray: string;
      green: string;
      orange: string;
      red: string;
    };
    transparentGrey: {
      light: string;
    };
    viewColumnGallery: {
      blue: string;
      purple: string;
      red: string;
    };
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
  filterCategoryColors: {
    darkBlue: { pale: '#BED0F9', strong: '#2563EB' },
    green: { pale: '#D1F39A', strong: '#A3E635' },
    lightBlue: { pale: '#93E9EB', strong: '#28D4D7' },
    orange: { pale: '#FDD497', strong: '#FBA930' },
    pink: { pale: ' #FCE4EC', strong: '#F48FB1' },
    purple: { pale: '#E5C0F5', strong: '#C026D3' },
    red: { pale: '#F1A8A8', strong: '#DC2626' },
    teal: { pale: '#99E9CC ', strong: '#34D399' },
    yellow: { pale: '#EEEA8F', strong: '#DDD520' },
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
    light: '#9f9f9f',
    main: 'rgba(0, 0, 0, 0.6)',
  },
  statusColors: {
    blue: 'rgba(25, 118, 210, 1)',
    gray: 'rgba(0, 0, 0, 0.12)',
    green: 'rgba(102, 187, 106, 1)',
    orange: 'rgba(245, 124, 0, 1)',
    red: 'rgba(239, 83, 80, 1)',
  },
  success: {
    light: '#9fdfb8',
    main: '#0eae4e',
  },
  text: {
    secondary: 'rgba(0, 0, 0, 0.6)',
  },
  transparentGrey: {
    light: 'rgba(0,0,0,0.04)',
  },
  viewColumnGallery: {
    blue: '#1976D2',
    purple: '#BA68C8',
    red: '#ED1C55',
  },
  warning: {
    main: '#ee8432',
  },
};

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
  palette: themePalette,
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

//The new theme palette
const newThemePalette = {
  activityStatusColors: {
    cancelled: '#6D6D6D',
    closed: '#D1D1D1',
    draft: '#F3C81C',
    ended: '#D1D1D1',
    published: '#1B9E4B',
    scheduled: '#3E6CD2',
  },
  background: {
    default: '#F9F9F9',
  },
  basic: {
    black: '#000000',
    white: '#FFFFFF',
  },
  error: {
    dark: '#8F2525',
    main: '#CE3434',
  },
  filterCategoryColors: {
    darkBlue: { pale: '#BED0F9', strong: '#2563EB' },
    green: { pale: '#D1F39A', strong: '#A3E635' },
    lightBlue: { pale: '#93E9EB', strong: '#28D4D7' },
    orange: { pale: '#FDD497', strong: '#FBA930' },
    pink: { pale: ' #FCE4EC', strong: '#F48FB1' },
    purple: { pale: '#E5C0F5', strong: '#C026D3' },
    red: { pale: '#F1A8A8', strong: '#DC2626' },
    teal: { pale: '#99E9CC ', strong: '#34D399' },
    yellow: { pale: '#EEEA8F', strong: '#DDD520' },
  },
  grey: {
    [100]: '#E7E7E7',
    [200]: '#D1D1D1',
    [25]: '#FBFBFB',
    [300]: '#B0B0B0',
    [400]: '#888888',
    [50]: '#F6F6F6',
    [500]: '#6D6D6D',
    [600]: '#5D5D5D',
    [700]: '#4F4F4F',
    [800]: '#454545',
    [900]: '#3D3D3D',
    [950]: '#252525',
  },
  info: {
    main: '#3E6CD2',
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
    dark: '#000000',
    light: '#5D5D5D',
    main: '#252525',
  },
  secondary: {
    light: '#9f9f9f',
    main: '#6D6D6D',
  },
  statusColors: {
    blue: 'rgba(25, 118, 210, 1)',
    gray: 'rgba(0, 0, 0, 0.12)',
    green: 'rgba(102, 187, 106, 1)',
    orange: 'rgba(245, 124, 0, 1)',
    red: 'rgba(239, 83, 80, 1)',
  },
  success: {
    light: '#9fdfb8',
    main: '#1B9E4B',
  },
  text: {
    primary: '#252525',
    secondary: '#6D6D6D',
  },
  transparentGrey: {
    light: 'rgba(0,0,0,0.04)',
  },
  viewColumnGallery: {
    blue: '#1976D2',
    purple: '#BA68C8',
    red: '#ED1C55',
  },
  warning: {
    dark: '#C4880A',
    main: '#F3C81C',
  },
};

// The new theme.
export const newTheme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          '&.Mui-disabled': {
            '&.MuiButton-containedError': {
              backgroundColor: '#EE7B7B',
            },
            '&.MuiButton-containedPrimary': {
              backgroundColor: '#5D5D5D',
              color: '#B0B0B0',
            },
            '&.MuiButton-containedWarning': {
              backgroundColor: '#FAED8E',
            },
            '&.MuiButton-outlinedPrimary': {
              borderColor: '#B0B0B0',
              color: '#888888',
            },
            '&.MuiButton-textPrimary': {
              color: '#888888',
            },
          },
          '&.MuiButtonGroup-groupedHorizontal:has(.MuiSvgIcon-root)': {
            '&.MuiButton-sizeLarge': {
              ' svg': {
                fontSize: '1.75em',
              },
            },
            '&.MuiButton-sizeMedium': {
              ' svg': {
                fontSize: '1.5rem',
              },
            },
            '&.MuiButton-sizeSmall': {
              ' svg': {
                fontSize: '1.25rem',
              },
              minWidth: '30px',
            },
            ':has(> svg)': {
              paddingLeft: 0,
              paddingRight: 0,
            },
          },
          ':hover': {
            boxShadow: 'none',
          },
          boxShadow: 'none',
        },
      },
    },
    MuiButtonGroup: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
        },
      },
    },
    MuiCircularProgress: {
      styleOverrides: {
        root: {
          color: '#B0B0B0',
        },
      },
    },
    MuiTypography: {
      defaultProps: {
        variantMapping: {
          bodyMdBold: 'p',
          bodyMdRegular: 'p',
          bodySmBold: 'p',
          bodySmRegular: 'p',
          headingLg: 'h1',
          headingMd: 'h2',
          headingSm: 'h3',
        },
      },
    },
  },
  elevation: {
    bottom: {
      big: {
        light: '0px 4px 40px 0px #00000014',
        medium: '0px 4px 40px 0px #0000001F',
      },
      small: {
        light: '0px 4px 20px 0px #00000014',
        medium: '0px 4px 20px 0px #0000001F',
      },
    },
    top: {
      big: {
        light: '0px -4px 40px 0px #00000014',
        medium: '0px -4px 40px 0px #0000001F',
      },
      small: {
        light: '0px -4px 20px 0px #00000014',
        medium: '0px -4px 20px 0px #0000001F',
      },
    },
  },
  palette: newThemePalette,
  typography: {
    body1: undefined,
    body2: undefined,
    bodyMdBold: {
      fontFamily: figtree.style.fontFamily,
      fontSize: '1rem',
      fontWeight: 600,
      letterSpacing: '0.01rem',
      lineHeight: '1.5rem',
    },
    bodyMdRegular: {
      fontFamily: figtree.style.fontFamily,
      fontSize: '1rem',
      fontWeight: 400,
      letterSpacing: '0.01rem',
      lineHeight: '1.5rem',
    },
    bodySmBold: {
      fontFamily: figtree.style.fontFamily,
      fontSize: '0.875rem',
      fontWeight: 600,
      letterSpacing: '0.01rem',
      lineHeight: '1.313rem',
    },
    bodySmRegular: {
      fontFamily: figtree.style.fontFamily,
      fontSize: '0.875rem',
      fontWeight: 400,
      letterSpacing: '0.01rem',
      lineHeight: '1.313rem',
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
    },
    caption: undefined,
    fontFamily: figtree.style.fontFamily,
    fontSize: 16,
    h1: undefined,
    h2: undefined,
    h3: undefined,
    h4: undefined,
    h5: undefined,
    h6: undefined,
    headingLg: {
      fontFamily: figtree.style.fontFamily,
      fontSize: '1.375rem',
      fontWeight: '500',
      letterSpacing: '-0.005rem',
      lineHeight: '1.788rem',
    },
    headingMd: {
      fontFamily: figtree.style.fontFamily,
      fontSize: '1.125rem',
      fontWeight: '500',
      letterSpacing: '-0.005rem',
      lineHeight: '1.463rem',
    },
    headingSm: {
      fontFamily: figtree.style.fontFamily,
      fontSize: '1rem',
      fontWeight: '500',
      letterSpacing: '-0.005rem',
      lineHeight: '1.3rem',
    },
    labelMdMedium: {
      fontFamily: figtree.style.fontFamily,
      fontSize: '0.875rem',
      fontWeight: '500',
      letterSpacing: '0.03rem',
      lineHeight: '1.313rem',
    },
    labelMdRegular: {
      fontFamily: figtree.style.fontFamily,
      fontSize: '0.875rem',
      fontWeight: '400',
      letterSpacing: '0.03rem',
      lineHeight: '1.313rem',
    },
    linkMd: {
      fontFamily: figtree.style.fontFamily,
      fontSize: '1rem',
      fontWeight: '400',
      lineHeight: '1.5rem',
    },
    linkSm: {
      fontFamily: figtree.style.fontFamily,
      fontSize: '0.875rem',
      fontWeight: '400',
      lineHeight: '1.313rem',
    },
    overline: undefined,
    subtitle1: undefined,
    subtitle2: undefined,
  },
});

const locales: Record<string, Localization> = {};
locales['da'] = daDK;
locales['de'] = deDE;
locales['nn'] = nbNO;
locales['sv'] = svSE;

export const themeWithLocale = (lang: string) => {
  return createTheme(theme, locales[lang]);
};

export default theme;
