/* eslint-disable @typescript-eslint/no-empty-function */
import { Snackbar } from '@material-ui/core';
import { useIntl } from 'react-intl';
import { Alert, Color } from '@material-ui/lab';
import { createContext, useState } from 'react';

interface ZUISnackbarContextProps {
  isOpen: boolean;
  hideSnackbar: () => void;
  showSnackbar: (severity: Color, message?: string) => void;
}

const ZUISnackbarContext = createContext<ZUISnackbarContextProps>({
  hideSnackbar: () => {},
  isOpen: false,
  showSnackbar: () => {},
});

interface SnackbarProviderProps {
  children: React.ReactNode;
}

const ZUISnackbarProvider: React.FunctionComponent<SnackbarProviderProps> = ({
  children,
}) => {
  const intl = useIntl();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarState, setSnackbarState] = useState<{
    message: string;
    severity: Color;
  }>();

  const showSnackbar: ZUISnackbarContextProps['showSnackbar'] = (
    severity,
    customMessage?
  ) => {
    const message =
      customMessage || intl.formatMessage({ id: `misc.snackbar.${severity}` });
    setSnackbarOpen(true);
    setSnackbarState({
      message,
      severity,
    });
  };

  const hideSnackbar: ZUISnackbarContextProps['hideSnackbar'] = () => {
    setSnackbarOpen(false);
    setSnackbarState(undefined);
  };

  return (
    <>
      <ZUISnackbarContext.Provider
        value={{
          hideSnackbar,
          isOpen: Boolean(snackbarState),
          showSnackbar,
        }}
      >
        {children}
      </ZUISnackbarContext.Provider>
      <Snackbar
        autoHideDuration={5000}
        data-testid={`Snackbar-${snackbarState?.severity}`}
        onClose={() => {
          setSnackbarOpen(false);
        }}
        open={snackbarOpen}
        TransitionProps={{
          onExited: () => setSnackbarState(undefined),
        }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarState?.severity}
        >
          {snackbarState?.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ZUISnackbarContext;

export { ZUISnackbarProvider };
