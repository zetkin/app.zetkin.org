import { createElement } from 'react';
import { createMuiTheme } from '@material-ui/core/styles';

// Create a theme instance.
const theme = createMuiTheme({
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
            default: '#fff',
        },
        error: {
            main: '#B3002D',
        },
        primary: {
            main: '#ED1C55',
        },
        secondary: {
            main: 'rgba(0, 0, 0, 0.6)',
        },
        text: {
            secondary: 'rgba(0, 0, 0, 0.6)',
        },
    },
    props: {
        MuiCard: {
            elevation: 2,
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
    },
});

export default theme;
