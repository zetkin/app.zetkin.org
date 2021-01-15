import { AppProps } from 'next/app';
import { Hydrate } from 'react-query/hydration';
import { ReactQueryDevtools } from 'react-query/devtools';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

function MyApp({ Component, pageProps } : AppProps) : JSX.Element {
    const { dehydratedState, ...extractedPageProps } = pageProps;

    return (
        <QueryClientProvider client={ queryClient }>
            <Hydrate state={ dehydratedState }>
                <Component { ...extractedPageProps } />
            </Hydrate>
            <ReactQueryDevtools initialIsOpen={ false } />
        </QueryClientProvider>
    );
}

export default MyApp;
