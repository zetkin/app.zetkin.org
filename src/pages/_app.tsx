import '../styles.css';

import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { AppProps } from 'next/app';
import createStore from 'core/store';
import CssBaseline from '@mui/material/CssBaseline';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { IntlProvider } from 'react-intl';
import { LicenseInfo } from '@mui/x-data-grid-pro';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { NoSsr } from '@mui/base';
import NProgress from 'nprogress';
import { Provider as ReduxProvider } from 'react-redux';
import { useEffect } from 'react';
import Router, { useRouter } from 'next/router';
import {
  StyledEngineProvider,
  Theme,
  ThemeProvider,
} from '@mui/material/styles';

import BrowserApiClient from 'core/api/client/BrowserApiClient';
import Environment from 'core/env/Environment';
import { EnvProvider } from 'core/env/EnvContext';
import { EventPopperProvider } from 'features/events/components/EventPopper/EventPopperProvider';
import { PageWithLayout } from '../utils/types';
import { themeWithLocale } from '../theme';
import { UserContext } from 'utils/hooks/useFocusDate';
import { ZUIConfirmDialogProvider } from 'zui/ZUIConfirmDialogProvider';
import { ZUISnackbarProvider } from 'zui/ZUISnackbarContext';

declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}

// MUI-X license
if (process.env.NEXT_PUBLIC_MUIX_LICENSE_KEY) {
  LicenseInfo.setLicenseKey(process.env.NEXT_PUBLIC_MUIX_LICENSE_KEY);
}

// Progress bar
NProgress.configure({ showSpinner: false });
Router.events.on(
  'routeChangeStart',
  (url, { shallow }) => !shallow && NProgress.start()
);
Router.events.on(
  'routeChangeComplete',
  (url, { shallow }) => !shallow && NProgress.done()
);
Router.events.on(
  'routeChangeError',
  (url, { shallow }) => !shallow && NProgress.done()
);

declare global {
  interface Window {
    __reactRendered: boolean;
  }
}

const store = createStore();

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  const router = useRouter();
  const { lang, messages, ...restProps } = pageProps;
  const c = Component as PageWithLayout;
  const getLayout = c.getLayout || ((page) => page);

  if (typeof window !== 'undefined') {
    window.__reactRendered = true;
  }

  const env = new Environment(store, new BrowserApiClient(), router);

  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement?.removeChild(jssStyles);
    }
  }, []);

  return (
    <ReduxProvider store={store}>
      <EnvProvider env={env}>
        <UserContext.Provider value={pageProps.user}>
          <StyledEngineProvider injectFirst>
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
                          <CssBaseline />
                          <NoSsr>
                            {getLayout(<Component {...restProps} />, restProps)}
                          </NoSsr>
                        </DndProvider>
                      </EventPopperProvider>
                    </ZUIConfirmDialogProvider>
                  </ZUISnackbarProvider>
                </IntlProvider>
              </LocalizationProvider>
            </ThemeProvider>
          </StyledEngineProvider>
        </UserContext.Provider>
      </EnvProvider>
    </ReduxProvider>
  );
}

export default MyApp;
