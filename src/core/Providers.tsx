import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { IntlProvider } from 'react-intl';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { Provider as ReduxProvider } from 'react-redux';
import { FC, ReactNode } from 'react';
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';

import Environment from './env/Environment';
import { EnvProvider } from 'core/env/EnvContext';
import { EventPopperProvider } from 'features/events/components/EventPopper/EventPopperProvider';
import { MessageList } from 'utils/locale';
import { Store } from './store';
import { themeWithLocale } from '../theme';
import { ZetkinUser } from 'utils/types/zetkin';
import { ZUIConfirmDialogProvider } from 'zui/ZUIConfirmDialogProvider';
import { ZUISnackbarProvider } from 'zui/ZUISnackbarContext';
import { UserProvider } from './env/UserContext';

type ProviderData = {
  env: Environment;
  lang: string;
  messages: MessageList;
  store: Store;
  user: ZetkinUser;
};

type ProvidersProps = ProviderData & {
  children: ReactNode;
};

declare global {
  interface Window {
    providerData: ProviderData;
  }
}

const Providers: FC<ProvidersProps> = ({
  children,
  env,
  lang,
  messages,
  store,
  user,
}) => {
  if (typeof window !== 'undefined' && !window.providerData) {
    // Store provider data on window so that it can be picked
    // up by the block renderers in editor.js (see EmailEditor)
    window.providerData = {
      env,
      lang,
      messages,
      store,
      user,
    };
  }

  const cache = createCache({ key: 'css', prepend: true });

  return (
    <ReduxProvider store={store}>
      <EnvProvider env={env}>
        <UserProvider user={user}>
          <StyledEngineProvider injectFirst>
            <CacheProvider value={cache}>
              <ThemeProvider theme={themeWithLocale(lang)}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <IntlProvider
                    defaultLocale="en"
                    locale={lang}
                    messages={messages}
                  >
                    <ZUISnackbarProvider>
                      <ZUIConfirmDialogProvider>
                        <EventPopperProvider>
                          <DndProvider backend={HTML5Backend}>
                            {children}
                          </DndProvider>
                        </EventPopperProvider>
                      </ZUIConfirmDialogProvider>
                    </ZUISnackbarProvider>
                  </IntlProvider>
                </LocalizationProvider>
              </ThemeProvider>
            </CacheProvider>
          </StyledEngineProvider>
        </UserProvider>
      </EnvProvider>
    </ReduxProvider>
  );
};

export default Providers;
