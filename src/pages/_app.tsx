import '../styles.css';
import { AppProps } from 'next/app';
import { Hydrate } from 'react-query/hydration';
import { ReactQueryDevtools } from 'react-query/devtools';
import { SSRProvider } from '@react-aria/ssr';
import { defaultTheme, Provider } from '@adobe/react-spectrum';
import { QueryClient, QueryClientProvider } from 'react-query';

import DefaultLayout from '../components/layout/DefaultLayout';
import { PageWithLayout } from '../types/index';

const queryClient = new QueryClient();

function MyApp({ Component, pageProps } : AppProps) : JSX.Element {
    const { dehydratedState, ...restProps } = pageProps;
    const c = Component as PageWithLayout;
    const getLayout = c.getLayout || (page => <DefaultLayout>{ page }</DefaultLayout>);

    return (
        <SSRProvider>
            <Provider theme={ defaultTheme }>
                <QueryClientProvider client={ queryClient }>
                    <Hydrate state={ dehydratedState }>
                        { getLayout(<Component { ...restProps } />, restProps) }
                    </Hydrate>
                    <ReactQueryDevtools initialIsOpen={ false } />
                </QueryClientProvider>
            </Provider>
        </SSRProvider>
    );
}

export default MyApp;