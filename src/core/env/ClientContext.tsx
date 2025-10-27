'use client';

import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { IntlProvider } from 'react-intl';
import { Provider as ReduxProvider } from 'react-redux';
import { FC, ReactNode, Suspense, useRef } from 'react';
import {
  StyledEngineProvider,
  Theme,
  ThemeProvider,
} from '@mui/material/styles';
import { LicenseInfo, LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';

import BrowserApiClient from 'core/api/client/BrowserApiClient';
import Environment, { EnvVars } from 'core/env/Environment';
import { EnvProvider } from 'core/env/EnvContext';
import { MessageList } from 'utils/locale';
import createStore, { Store } from 'core/store';
import { oldThemeWithLocale } from '../../theme';
import { UserProvider } from './UserContext';
import { ZetkinUser } from 'utils/types/zetkin';
import BackendApiClient from 'core/api/client/BackendApiClient';
import { ZUIConfirmDialogProvider } from 'zui/ZUIConfirmDialogProvider';
import { ZUISnackbarProvider } from 'zui/ZUISnackbarContext';

declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface DefaultTheme extends Theme {}
}

type ClientContextProps = {
  children: ReactNode;
  envVars: EnvVars;
  headers: Record<string, string>;
  lang: string;
  messages: MessageList;
  user: ZetkinUser | null;
};

const ClientContext: FC<ClientContextProps> = ({
  children,
  envVars,
  headers,
  lang,
  messages,
  user,
}) => {
  const onServer = typeof window == 'undefined';
  const storeRef = useRef<Store | null>(null);

  if (!storeRef.current) {
    storeRef.current = createStore();
  }

  const apiClient = onServer
    ? new BackendApiClient(headers)
    : new BrowserApiClient();

  const env = new Environment(apiClient, envVars);
  const cache = createCache({ key: 'css', prepend: true });

  // MUI-X license
  if (env.vars.MUIX_LICENSE_KEY) {
    LicenseInfo.setLicenseKey(env.vars.MUIX_LICENSE_KEY);
  }

  return (
    <ReduxProvider store={storeRef.current}>
      <StyledEngineProvider injectFirst>
        <CacheProvider value={cache}>
          <ThemeProvider theme={oldThemeWithLocale(lang)}>
            <EnvProvider env={env}>
              <UserProvider user={user}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <IntlProvider
                    defaultLocale="en"
                    locale={lang}
                    messages={messages}
                  >
                    <ZUISnackbarProvider>
                      <IntlProvider
                        defaultLocale="en"
                        locale={lang}
                        messages={messages}
                      >
                        <ZUIConfirmDialogProvider>
                          <CssBaseline />
                          <Suspense>{children}</Suspense>
                        </ZUIConfirmDialogProvider>
                      </IntlProvider>
                    </ZUISnackbarProvider>
                  </IntlProvider>
                </LocalizationProvider>
              </UserProvider>
            </EnvProvider>
          </ThemeProvider>
        </CacheProvider>
      </StyledEngineProvider>
    </ReduxProvider>
  );
};

export default ClientContext;
