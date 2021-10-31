import '../styles.css';

import { AppProps } from 'next/app';
import CssBaseline from '@material-ui/core/CssBaseline';
import DateUtils from '@date-io/dayjs';
import dayjs from 'dayjs';
import { Hydrate } from 'react-query/hydration';
import { IntlProvider } from 'react-intl';
import isoWeek from 'dayjs/plugin/isoWeek';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import NProgress from 'nprogress';
import { ReactQueryDevtools } from 'react-query/devtools';
import Router from 'next/router';
import { StyledEngineProvider } from '@mui/material/styles';
import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Theme, ThemeProvider } from '@mui/material/styles';

import { LocalTimeToJsonPlugin } from 'utils/dateUtils';
import { PageWithLayout } from '../types';
import theme from '../theme';
import { UserContext } from '../hooks';


declare module '@material-ui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}


dayjs.extend(LocalTimeToJsonPlugin);
dayjs.extend(isoWeek);

// Progress bar
NProgress.configure({ showSpinner: false });
Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

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

function MyApp({ Component, pageProps } : AppProps) : JSX.Element {
    const { dehydratedState, lang, messages, ...restProps } = pageProps;
    const c = Component as PageWithLayout;
    const getLayout = c.getLayout || (page => <>{ page }</>);

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
        <UserContext.Provider value={ pageProps.user }>
            <StyledEngineProvider injectFirst>
                <ThemeProvider theme={ theme }>
                    <MuiPickersUtilsProvider libInstance={ dayjs } utils={ DateUtils }>
                        <IntlProvider
                            defaultLocale="en"
                            locale={ lang }
                            messages={ messages }>
                            <QueryClientProvider client={ queryClient }>
                                <Hydrate state={ dehydratedState }>
                                    <CssBaseline />
                                    { getLayout(<Component { ...restProps } />, restProps) }
                                </Hydrate>
                                <ReactQueryDevtools initialIsOpen={ false } />
                            </QueryClientProvider>
                        </IntlProvider>
                    </MuiPickersUtilsProvider>
                </ThemeProvider>
            </StyledEngineProvider>
        </UserContext.Provider>
    );
}

export default MyApp;
