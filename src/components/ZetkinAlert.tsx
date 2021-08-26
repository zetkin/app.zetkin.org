import { FunctionComponent } from 'react';
import { makeStyles } from '@material-ui/core';
import { Alert, Color } from '@material-ui/lab';

interface ZetkinAlertProps {
    alertSeverity: Color;
}

const useStyles = makeStyles(() => ({
    zetkinAlertBright: {
        color: '#555',
    },
    zetkinAlertDark: {
        color: '#fff',
    },
}));

const ZetkinAlert: FunctionComponent<ZetkinAlertProps> = ({
    children, alertSeverity }) : JSX.Element => {
    const classes = useStyles();

    return (
        <Alert
            className={
                alertSeverity == 'info' ?
                    classes.zetkinAlertDark :
                    classes.zetkinAlertBright }
            elevation={ 2 }
            severity={ alertSeverity }
            variant="filled">
            { children }
        </Alert>
    );
};

export default ZetkinAlert;
