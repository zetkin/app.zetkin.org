import '../styles.css';
import '../utils/polyfills';
import { AppProps } from 'next/app';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Hydrate } from 'react-query/hydration';
import { IntlProvider } from 'react-intl';
import { ReactQueryDevtools } from 'react-query/devtools';
import { SSRProvider } from '@react-aria/ssr';
import theme from '../theme';
import { ThemeProvider } from '@material-ui/core/styles';
import { useEffect } from 'react';
import UserContext from '../contexts/UserContext';
import { defaultTheme, Provider } from '@adobe/react-spectrum';
import { QueryClient, QueryClientProvider } from 'react-query';

import DefaultLayout from '../components/layout/DefaultLayout';
import OrganizationContext from '../contexts/OrganizationContext';
import { PageWithLayout } from '../types';

const queryClient = new QueryClient();

declare global {
    interface Window {
        __reactRendered: boolean;
    }
}

function MyApp({ Component, pageProps } : AppProps) : JSX.Element {
    const { dehydratedState, lang, messages, ...restProps } = pageProps;
    const c = Component as PageWithLayout;
    const getLayout = c.getLayout || (page => <DefaultLayout>{ page }</DefaultLayout>);

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
            <OrganizationContext.Provider value={{ orgId: pageProps.orgId }}>
                <SSRProvider>
                    <ThemeProvider theme={ theme }>
                        <Provider theme={ defaultTheme }>
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
                        </Provider>
                    </ThemeProvider>
                </SSRProvider>
            </OrganizationContext.Provider>
        </UserContext.Provider>
    );
}

export default MyApp;
