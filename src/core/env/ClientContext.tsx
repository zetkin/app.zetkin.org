'use client';

import BrowserApiClient from 'core/api/client/BrowserApiClient';
import CssBaseline from '@mui/material/CssBaseline';
import Environment from 'core/env/Environment';
import { EnvProvider } from 'core/env/EnvContext';
import { IntlProvider } from 'react-intl';
import { MessageList } from 'utils/locale';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from 'core/store';
import { themeWithLocale } from '../../theme';
import { UserProvider } from './UserContext';
import { ZetkinUser } from 'utils/types/zetkin';
import { FC, ReactNode } from 'react';
import {
  StyledEngineProvider,
  Theme,
  ThemeProvider,
} from '@mui/material/styles';

declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}

type ClientContextProps = {
  children: ReactNode;
  lang: string;
  messages: MessageList;
  user: ZetkinUser | null;
};

const ClientContext: FC<ClientContextProps> = ({
  children,
  lang,
  messages,
  user,
}) => {
  const env = new Environment(store, new BrowserApiClient());
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
