'use client';

import BrowserApiClient from 'core/api/client/BrowserApiClient';
import createStore from 'core/store';
import CssBaseline from '@mui/material/CssBaseline';
import Environment from 'core/env/Environment';
import { EnvProvider } from 'core/env/EnvContext';
import { IntlProvider } from 'react-intl';
import { Provider as ReduxProvider } from 'react-redux';
import { themeWithLocale } from '../../theme';
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

export type ClientContextProps = {
  children: ReactNode;
};

const ClientContext: FC<ClientContextProps> = ({ children }) => {
  const store = createStore();
  const env = new Environment(store, new BrowserApiClient());
  const lang = 'sv';
  const messages = {};
  return (
    <ReduxProvider store={store}>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={themeWithLocale(lang)}>
          <EnvProvider env={env}>
            <IntlProvider defaultLocale="en" locale={lang} messages={messages}>
              <CssBaseline />
              {children}
            </IntlProvider>
          </EnvProvider>
        </ThemeProvider>
      </StyledEngineProvider>
    </ReduxProvider>
  );
};

export default ClientContext;
