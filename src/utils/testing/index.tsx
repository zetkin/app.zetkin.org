import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { CssBaseline } from '@mui/material';
import { IntlProvider } from 'react-intl';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Provider as ReduxProvider } from 'react-redux';
import { FC, ReactElement, ReactNode } from 'react';
import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';

import { AnyMessage } from 'core/i18n/messages';
import BrowserApiClient from 'core/api/client/BrowserApiClient';
import Environment from 'core/env/Environment';
import { EnvProvider } from 'core/env/EnvContext';
import IApiClient from 'core/api/client/IApiClient';
import RosaLuxemburgUser from '../../../integrationTesting/mockData/users/RosaLuxemburgUser';
import oldTheme from 'theme';
import { Store } from 'core/store';
import { UserProvider } from 'core/env/UserContext';
import mockApiClient from './mocks/mockApiClient';

interface ZetkinAppProvidersProps {
  children: React.ReactNode;
}

const ZetkinAppProviders: FC<ZetkinAppProvidersProps> = ({ children }) => {
  const env = new Environment(new BrowserApiClient(), {
    ZETKIN_APP_DOMAIN: 'https://app.zetkin.org',
  });

  return (
    <UserProvider user={null}>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={oldTheme}>
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
              <EnvProvider env={env}>
                <CssBaseline />

                {children}
              </EnvProvider>
            </IntlProvider>
          </LocalizationProvider>
        </ThemeProvider>
      </StyledEngineProvider>
    </UserProvider>
  );
};

type CustomRenderResult = RenderResult & {
  findByMessageId(message: AnyMessage): ReturnType<RenderResult['findByText']>;
  getByMessageId(message: AnyMessage): ReturnType<RenderResult['getByText']>;
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
    findByMessageId: (message) => result.findByText(message._id),
    getByMessageId: (message) => result.getByText(message._id),
  };
};

export * from '@testing-library/react';

export { customRender as render };

export const makeWrapper = (
  store: Store,
  apiClient: IApiClient = mockApiClient()
) =>
  function Wrapper({ children }: { children: ReactNode }) {
    const env = new Environment(apiClient);

    return (
      <ReduxProvider store={store}>
        <EnvProvider env={env}>
          <UserProvider user={RosaLuxemburgUser}>{children}</UserProvider>
        </EnvProvider>
      </ReduxProvider>
    );
  };
