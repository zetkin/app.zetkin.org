import { createMuiTheme } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';

// Create a theme instance.
const theme = createMuiTheme({
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
    },
});

export default theme;