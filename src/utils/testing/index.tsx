import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { CssBaseline } from '@mui/material';
import { IntlProvider } from 'react-intl';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { FC, ReactElement } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { render, RenderOptions, RenderResult } from '@testing-library/react';
import {
  StyledEngineProvider,
  Theme,
  ThemeProvider,
} from '@mui/material/styles';

import { Message } from 'core/i18n/messages';
import theme from 'theme';
import { UserContext } from 'utils/hooks/useFocusDate';

declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}

interface ZetkinAppProvidersProps {
  children: React.ReactNode;
}

const ZetkinAppProviders: FC<ZetkinAppProvidersProps> = ({ children }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  });

  return (
    <UserContext.Provider value={null}>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <IntlProvider
              defaultLocale="en"
              locale="en"
              messages={{}}
              onError={(err) => {
                if (err.code === 'MISSING_TRANSLATION') {
                  return;
                }
                throw err;
              }}
            >
              <QueryClientProvider client={queryClient}>
                <CssBaseline />
                {children}
              </QueryClientProvider>
            </IntlProvider>
          </LocalizationProvider>
        </ThemeProvider>
      </StyledEngineProvider>
    </UserContext.Provider>
  );
};

type CustomRenderResult = RenderResult & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getByMessageId(message: Message<any>): ReturnType<RenderResult['getByText']>;
};

/**
 * Render into a container which is appended to document.body.
 *
 * Replaces the default `render()` function from `@testing-library`
 * to include any required context providers and other configuration
 * specific to our application.
 */
const customRender = (
  ui: ReactElement | FC<unknown>,
  options?: Omit<RenderOptions, 'wrapper'>
): CustomRenderResult => {
  const result = render(ui as ReactElement, {
    wrapper: ZetkinAppProviders,
    ...options,
  });

  return {
    ...result,
    getByMessageId: (message) => result.getByText(message._id),
  };
};

export * from '@testing-library/react';

export { customRender as render };
