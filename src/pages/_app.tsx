import { AppProps } from 'next/app';
import { Hydrate } from 'react-query/hydration';
import { ReactQueryDevtools } from 'react-query/devtools';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

function MyApp({ Component, pageProps } : AppProps) : JSX.Element {
    return (
        <QueryClientProvider client={ queryClient }>
            <Hydrate state={ pageProps.dehydratedState }>
                <Component { ...pageProps } />
            </Hydrate>
            <ReactQueryDevtools initialIsOpen={ false } />
        </QueryClientProvider>
    );
}

export default MyApp;
