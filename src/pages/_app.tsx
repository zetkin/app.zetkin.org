import '../styles.css';

import { AppProps } from 'next/app';
import CssBaseline from '@material-ui/core/CssBaseline';
import DateUtils from '@date-io/dayjs';
import dayjs from 'dayjs';
import { Hydrate } from 'react-query/hydration';
import { IntlProvider } from 'react-intl';
import isoWeek from 'dayjs/plugin/isoWeek';
import { LicenseInfo } from '@mui/x-data-grid-pro';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import NProgress from 'nprogress';
import { ReactQueryDevtools } from 'react-query/devtools';
import Router from 'next/router';
import { ThemeProvider } from '@material-ui/core/styles';
import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

import { ConfirmDialogProvider } from 'zui/utils/ConfirmDialogProvider';
import { LocalTimeToJsonPlugin } from '../utils/dateUtils';
import { PageWithLayout } from '../utils/types';
import { SnackbarProvider } from 'zui/utils/SnackbarContext';
import theme from '../theme';
import { UserContext } from '../utils/hooks';

dayjs.extend(LocalTimeToJsonPlugin);
dayjs.extend(isoWeek);

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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

declare global {
  interface Window {
    __reactRendered: boolean;
  }
}

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  const { dehydratedState, lang, messages, ...restProps } = pageProps;
  const c = Component as PageWithLayout;
  const getLayout = c.getLayout || ((page) => <>{page}</>);

  if (typeof window !== 'undefined') {
    window.__reactRendered = true;
  }

  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement?.removeChild(jssStyles);
    }
  }, []);

  return (
    <UserContext.Provider value={pageProps.user}>
      <ThemeProvider theme={theme}>
        <MuiPickersUtilsProvider libInstance={dayjs} utils={DateUtils}>
          <IntlProvider defaultLocale="en" locale={lang} messages={messages}>
            <QueryClientProvider client={queryClient}>
              <SnackbarProvider>
                <ConfirmDialogProvider>
                  <Hydrate state={dehydratedState}>
                    <CssBaseline />
                    {getLayout(<Component {...restProps} />, restProps)}
                  </Hydrate>
                </ConfirmDialogProvider>
              </SnackbarProvider>
              <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
          </IntlProvider>
        </MuiPickersUtilsProvider>
      </ThemeProvider>
    </UserContext.Provider>
  );
}

export default MyApp;
