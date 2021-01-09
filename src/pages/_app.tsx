import { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Hydrate } from 'react-query/hydration';
import { ReactQueryDevtools } from 'react-query/devtools';

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
