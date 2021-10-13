/* eslint-disable react/display-name */
import { CssBaseline } from '@material-ui/core';
import DateUtils from '@date-io/dayjs';
import dayjs from 'dayjs';
import { IntlProvider } from 'react-intl';
import isoWeek from 'dayjs/plugin/isoWeek';
import { ThemeProvider } from '@material-ui/styles';
import { FC, ReactElement } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { render, RenderOptions, RenderResult } from '@testing-library/react';

import { LocalTimeToJsonPlugin } from 'utils/dateUtils';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import theme from 'theme';
import { UserContext } from 'hooks';

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
            <ThemeProvider theme={ theme }>
                <MuiPickersUtilsProvider libInstance={ dayjs } utils={ DateUtils }>
                    <IntlProvider
                        defaultLocale="en"
                        locale="en"
                        messages={{}}>
                        <QueryClientProvider client={ queryClient }>
                            <CssBaseline />
                            { children }
                        </QueryClientProvider>
                    </IntlProvider>
                </MuiPickersUtilsProvider>
            </ThemeProvider>
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

export { default as useRouterMock } from './useRouterMock';

export { customRender as render };


