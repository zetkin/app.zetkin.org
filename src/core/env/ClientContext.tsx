'use client';

import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { IntlProvider } from 'react-intl';
import { Provider as ReduxProvider } from 'react-redux';
import { FC, ReactNode } from 'react';
import {
  StyledEngineProvider,
  Theme,
  ThemeProvider,
} from '@mui/material/styles';
import { LicenseInfo, LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';

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

/**
 * Defines the runtime environment variables available to client-side code.
 *
 * These are made available to [app router](https://nextjs.org/docs/app) code
 * via `ClientContext` and to [pages router](https://nextjs.org/docs/pages) code
 * via `scaffold()`.
 *
 * We use the same type alias for both routers in order to
 * keep the runtime environment variables aligned across this architectural
 * boundary. Keeping them aligned in this way is intended to facilitate gradual
 * adoption of the app router by minimising friction related to environment
 * variables.
 *
 * @category Environment Variables
 */
export type ClientContextEnvVars = {
  FEAT_AREAS: string | null;
  INSTANCE_OWNER_HREF: string | null;
  INSTANCE_OWNER_NAME: string | null;
  MUIX_LICENSE_KEY: string | null;
  ZETKIN_APP_DOMAIN: string | null;
  ZETKIN_GEN2_ORGANIZE_URL: string | null;
  ZETKIN_PRIVACY_POLICY_LINK: string | null;
};

type ClientContextProps = {
  children: ReactNode;
  envVars: ClientContextEnvVars;
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

  const env = new Environment(apiClient, envVars);
  const cache = createCache({ key: 'css', prepend: true });

  // MUI-X license
  if (env.vars.MUIX_LICENSE_KEY) {
    LicenseInfo.setLicenseKey(env.vars.MUIX_LICENSE_KEY);
  }

  return (
    <ReduxProvider store={store}>
      <StyledEngineProvider injectFirst>
        <CacheProvider value={cache}>
          <ThemeProvider theme={themeWithLocale(lang)}>
            <EnvProvider env={env}>
              <UserProvider user={user}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <IntlProvider
                    defaultLocale="en"
                    locale={lang}
                    messages={messages}
                  >
                    <CssBaseline />
                    {children}
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
