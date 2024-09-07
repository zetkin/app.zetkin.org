'use client';

import CssBaseline from '@mui/material/CssBaseline';
import { IntlProvider } from 'react-intl';
import { Provider as ReduxProvider } from 'react-redux';
import { FC, ReactNode } from 'react';
import {
  StyledEngineProvider,
  Theme,
  ThemeProvider,
} from '@mui/material/styles';

import BrowserApiClient from 'core/api/client/BrowserApiClient';
import Environment from 'core/env/Environment';
import { EnvProvider } from 'core/env/EnvContext';
import { MessageList } from 'utils/locale';
import { store } from 'core/store';
import { themeWithLocale } from '../../theme';
import { UserProvider } from './UserContext';
import { ZetkinUser } from 'utils/types/zetkin';
import BackendApiClient from 'core/api/client/BackendApiClient';

declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}

type ClientContextProps = {
  children: ReactNode;
  envVars: {
    MUIX_LICENSE_KEY: string | null;
    ZETKIN_APP_DOMAIN: string | null;
  };
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

  const apiClient = onServer
    ? new BackendApiClient(headers)
    : new BrowserApiClient();

  const env = new Environment(store, apiClient, envVars);
  return (
    <ReduxProvider store={store}>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={themeWithLocale(lang)}>
          <EnvProvider env={env}>
            <UserProvider user={user}>
              <IntlProvider
                defaultLocale="en"
                locale={lang}
                messages={messages}
              >
                <CssBaseline />
                {children}
              </IntlProvider>
            </UserProvider>
          </EnvProvider>
        </ThemeProvider>
      </StyledEngineProvider>
    </ReduxProvider>
  );
};

export default ClientContext;
