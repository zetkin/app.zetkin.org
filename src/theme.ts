import { createMuiTheme } from '@material-ui/core/styles';
import { grey, red } from '@material-ui/core/colors';

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
            main: red.A400,
        },
        primary: {
            main: '#553cd6',
        },
        secondary: {
            main: '#585858',
        },
        text: {
            secondary: grey[500],
        },
    },
});

export default theme;
