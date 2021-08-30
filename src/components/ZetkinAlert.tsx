import { FunctionComponent } from 'react';
import { makeStyles } from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
import { Box, Link } from '@material-ui/core';

type Severity = 'error' | 'success' | 'warning' | 'info';

interface ZetkinAlertProps {
    actionLabel?: string;
    onAction?: () => void;
    severity: Severity;
    title: string;
}

const useStyles = makeStyles(() => ({
    link: {
        '&:hover': {
            cursor: 'pointer',
        },
        color: 'inherit',
        textTransform: 'uppercase',
    },
    zetkinAlert:{
        '& > .MuiAlert-message':{
            width:'100%',
        },
    },
    zetkinAlertBright: {
        color: '#464646',
    },
    zetkinAlertDark: {
        color: '#F9F9F9',
    },
}));




const ZetkinAlert: FunctionComponent<ZetkinAlertProps> = ({ title, actionLabel, onAction, severity }): JSX.Element => {
    const classes = useStyles();

    return (
        <Alert
            className={ [
                severity == 'info' ?
                    classes.zetkinAlertDark :
                    classes.zetkinAlertBright,
                classes.zetkinAlert].join(' ')
            }
            severity={ severity }
            variant="filled">

            <Box
                display="flex"
                justifyContent="space-between"
                width="100%">
                <AlertTitle>
                    { title }
                </AlertTitle>
                { actionLabel &&
                    <Link
                        className={ classes.link }
                        onClick={ onAction }
                        underline="none">
                        { actionLabel }
                    </Link>
                }
            </Box>
        </Alert>
    );
};

export default ZetkinAlert;
