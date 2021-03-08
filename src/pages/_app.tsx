import '../styles.css';
import { AppProps } from 'next/app';
import { Hydrate } from 'react-query/hydration';
import { IntlProvider } from 'react-intl';
import { ReactQueryDevtools } from 'react-query/devtools';
import { SSRProvider } from '@react-aria/ssr';
import { UserContext } from '../hooks';
import { defaultTheme, Provider } from '@adobe/react-spectrum';
import { QueryClient, QueryClientProvider } from 'react-query';

import DefaultLayout from '../components/layout/DefaultLayout';
import { PageWithLayout } from '../types';

const queryClient = new QueryClient();

declare global {
    interface Window {
        __reactRendered: boolean;
    }
}

function MyApp({ Component, pageProps } : AppProps) : JSX.Element {
    const { dehydratedState, ...restProps } = pageProps;
    const c = Component as PageWithLayout;
    const getLayout = c.getLayout || (page => <DefaultLayout>{ page }</DefaultLayout>);

    if (typeof window !== 'undefined') {
        window.__reactRendered = true;
    }

    return (
        <UserContext.Provider value={ pageProps.user }>
            <SSRProvider>
                <Provider theme={ defaultTheme }>
                    <IntlProvider
                        defaultLocale="en"
                        locale="en"
                        messages={{}}>
                        <QueryClientProvider client={ queryClient }>
                            <Hydrate state={ dehydratedState }>
                                { getLayout(<Component { ...restProps } />, restProps) }
                            </Hydrate>
                            <ReactQueryDevtools initialIsOpen={ false } />
                        </QueryClientProvider>
                    </IntlProvider>
                </Provider>
            </SSRProvider>
        </UserContext.Provider>
    );
}

export default MyApp;