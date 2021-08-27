import { FunctionComponent } from 'react';
import { makeStyles } from '@material-ui/core';
import { Alert, Color } from '@material-ui/lab';

interface ZetkinAlertProps {
    alertSeverity: Color;
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

const ZetkinAlert: FunctionComponent<ZetkinAlertProps> = ({
    children, alertSeverity }) : JSX.Element => {
    const classes = useStyles();

    return (
        <Alert
            className={ [
                alertSeverity == 'info' ?
                    classes.zetkinAlertDark :
                    classes.zetkinAlertBright,
                classes.zetkinAlert].join(' ') }
            elevation={ 2 }
            severity={ alertSeverity }
            variant="filled">
            { children }
        </Alert>
    );
};

export default ZetkinAlert;
