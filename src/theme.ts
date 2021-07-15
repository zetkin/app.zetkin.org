import { createMuiTheme } from '@material-ui/core/styles';
import { grey } from '@material-ui/core/colors';

// Create a theme instance.
const theme = createMuiTheme({
    overrides: {
        MuiButton: {
            root: {
                minWidth: '1rem',
                textTransform: 'none',
            },
        },
        MuiCard: {
            root: {
                backgroundColor: 'transparent',
                borderColor: grey[400],
                borderWidth: 2,
            },
        },
        MuiCardActions: {
            root: {
                display: 'flex',
                justifyContent: 'flex-end',
            },
        },
        MuiFormControl: {
            root: {
                minWidth: 120,
            },
        },
        MuiTab: {
            root: {
                textTransform: 'none',
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
    typography: {
        fontFamily: 'azo-sans-web',
    },
});

export default theme;
