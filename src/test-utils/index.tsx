import { CssBaseline } from '@mui/material';
import dayjs from 'dayjs';
import { IntlProvider } from 'react-intl';
import isoWeek from 'dayjs/plugin/isoWeek';
import { StyledEngineProvider } from '@mui/material/styles';
import { FC, ReactElement } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { Theme, ThemeProvider } from '@mui/material/styles';

import { LocalTimeToJsonPlugin } from 'utils/dateUtils';
import theme from 'theme';
import { UserContext } from 'hooks';


declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}


dayjs.extend(LocalTimeToJsonPlugin);
dayjs.extend(isoWeek);

const ZetkinAppProviders: FC = ({ children }) => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnWindowFocus: false,
            },
        },
    });

    return (
        <UserContext.Provider value={ null }>
            <StyledEngineProvider injectFirst>
                <ThemeProvider theme={ theme }>
                    <IntlProvider
                        defaultLocale="en"
                        locale="en"
                        messages={{}}
                        onError={ (err) => {
                            if (err.code === 'MISSING_TRANSLATION') {
                                return;
                            }
                            throw err;
                        } }>
                        <QueryClientProvider client={ queryClient }>
                            <CssBaseline />
                            { children }
                        </QueryClientProvider>
                    </IntlProvider>
                </ThemeProvider>
            </StyledEngineProvider>
        </UserContext.Provider>
    );
};

/**
 * Render into a container which is appended to document.body.
 *
 * Replaces the default `render()` function from `@testing-library`
 * to include any required context providers and other configuration
 * specific to our application.
 */
const customRender = (
    ui: ReactElement| FC<unknown>,
    options?: Omit<RenderOptions, 'wrapper'>,
): RenderResult => render(ui as ReactElement, { wrapper: ZetkinAppProviders, ...options });

export * from '@testing-library/react';

export { customRender as render };


