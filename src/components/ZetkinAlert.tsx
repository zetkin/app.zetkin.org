import { Alert, AlertTitle } from '@material-ui/lab';
import { FunctionComponent } from 'react';
import { makeStyles } from '@material-ui/core';
import { Box, Button , Link, Typography } from '@material-ui/core';

interface ZetkinAlertProps {
    severity: string;
    title: string;
    onAction?: Function;
    actionLabel?: string;
}

const useStyles = makeStyles(() => ({
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
            variant="filled">

            <Box
                display="flex"
                justifyContent="space-between"
                width="100%">
                <AlertTitle>
                    { title }
                </AlertTitle>
                { actionLabel &&
                    <Typography
                        align="left">
                        <Link
                            color="inherit"
                            underline="never"
                            onClick={ onAction }
                            >
                            { actionLabel }
                        </Link>
                    </Typography>
                }
            </Box>
        </Alert>
    );
};

export default ZetkinAlert;
