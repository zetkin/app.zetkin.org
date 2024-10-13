/* eslint-disable @typescript-eslint/no-empty-function */
import { Snackbar } from '@mui/material';
import { Alert, AlertColor } from '@mui/material';
import { createContext, ReactNode, useState } from 'react';

import { useMessages } from 'core/i18n';
import messageIds from './l10n/messageIds';

interface ZUISnackbarContextProps {
  isOpen: boolean;
  hideSnackbar: () => void;
  showSnackbar: (severity: AlertColor, message?: ReactNode) => void;
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
  const messages = useMessages(messageIds);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarState, setSnackbarState] = useState<{
    message: ReactNode;
    severity: AlertColor;
  }>();

  const showSnackbar: ZUISnackbarContextProps['showSnackbar'] = (
    severity,
    customMessage?
  ) => {
    const message = customMessage || messages.snackbar[severity]();
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
