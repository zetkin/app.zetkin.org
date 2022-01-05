/* eslint-disable @typescript-eslint/no-empty-function */
import { Snackbar } from '@material-ui/core';
import { Alert, Color } from '@material-ui/lab';
import { createContext, useState } from 'react';

interface SnackbarContextProps {
    isOpen: boolean;
    hideSnackbar: () => void;
    showSnackbar: (severity: Color, message: string) => void;
}

const SnackbarContext = createContext<SnackbarContextProps>({
    hideSnackbar: () => {},
    isOpen: false,
    showSnackbar: () => {},
});

const SnackbarProvider: React.FunctionComponent = ({ children }) => {
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarState, setSnackbarState] = useState<{
        message: string;
        severity: Color;
    }>();

    const showSnackbar: SnackbarContextProps['showSnackbar'] = (severity, message) => {
        setSnackbarOpen(true);
        setSnackbarState({
            message,
            severity,
        });
    };

    const hideSnackbar: SnackbarContextProps['hideSnackbar'] = () => {
        setSnackbarOpen(false);
        setSnackbarState(undefined);
    };

    return (
        <>
            <SnackbarContext.Provider value={{
                hideSnackbar,
                isOpen: Boolean(snackbarState),
                showSnackbar,
            }}>
                { children }
            </SnackbarContext.Provider>
            <Snackbar
                autoHideDuration={ 5000 }
                onClose={ () => {
                    setSnackbarOpen(false);
                } }
                open={ snackbarOpen }
                TransitionProps={{
                    onExited: () => setSnackbarState(undefined),
                }}>
                <Alert onClose={ () => setSnackbarOpen(false) } severity={ snackbarState?.severity }>
                    { snackbarState?.message }
                </Alert>

            </Snackbar>
        </>

    );
};

export default SnackbarContext;

export { SnackbarProvider };