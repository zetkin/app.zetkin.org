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
  lang: string;
  messages: MessageList;
  user: ZetkinUser | null;
};

const ClientContext: FC<ClientContextProps> = ({
  children,
  envVars,
  lang,
  messages,
  user,
}) => {
  const env = new Environment(store, new BrowserApiClient(), envVars);
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
