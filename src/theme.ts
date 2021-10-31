import { createElement } from 'react';
import { createTheme } from '@mui/material/styles';

// Create a theme instance.
const theme = createTheme({
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    minWidth: '1rem',
                    textTransform: 'none',
                } },
        },
        MuiCard: {
            defaultProps: {
                elevation: 2,
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
            styleOverrides:{
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
        MuiLink: {
            defaultProps: {
                underline: 'hover',
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
        MuiTextField: {
            defaultProps: {
                variant: 'standard',
            },
        },
        MuiTooltip: {
            defaultProps: {
                disableInteractive: true,
            },
            styleOverrides: {
                tooltip: {
                    fontSize: '14px',
                },
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
