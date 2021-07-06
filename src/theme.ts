import { Overrides as CoreOverrides } from '@material-ui/core/styles/overrides';
import { createMuiTheme } from '@material-ui/core/styles';
import { CSSProperties } from '@material-ui/styles';
import { SpeedDialClassKey } from '@material-ui/lab';
import { grey, red } from '@material-ui/core/colors';

interface Overrides extends CoreOverrides {
    // Define additional lab components here as needed....
    MuiSpeedDial?: Partial<Record<SpeedDialClassKey, CSSProperties | (() => CSSProperties)>> | undefined;
}

// Create a theme instance.
const theme = createMuiTheme({
    overrides: {
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
    } as Overrides,
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
