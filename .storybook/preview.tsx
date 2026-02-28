import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import Environment from 'core/env/Environment';
import FetchApiClient from 'core/api/client/FetchApiClient';
import { EnvProvider } from 'core/env/EnvContext';
import { IntlProvider } from 'react-intl';
import isoWeek from 'dayjs/plugin/isoWeek';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Provider as ReduxProvider } from 'react-redux';
import { ThemeProvider } from '@mui/material';
import React, { FC, PropsWithChildren, useMemo } from 'react';
import { Decorator, Preview } from '@storybook/nextjs';
import { themes, ThemeVars } from 'storybook/theming';

import newTheme from '../src/zui/theme';
import '../src/styles.css';
import mockPerson from '../src/utils/testing/mocks/mockPerson';
import createStore from '../src/core/store';
import { LicenseInfo } from '@mui/x-license';
import CssBaseline from '@mui/material/CssBaseline';
import { DocsContainer, DocsContainerProps } from '@storybook/addon-docs/blocks';
import { createTheme } from '@mui/material/styles';
import { darkPalette } from 'zui/theme/palette';
import { useStorybookDarkMode } from 'zui/hooks/useStorybookDarkMode';

dayjs.extend(isoWeek);

const I18nProvider: FC<PropsWithChildren> = (props) => {
  return (
    <IntlProvider defaultLocale="en" locale="en" messages={{}}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        {props.children}
      </LocalizationProvider>
    </IntlProvider>
  );
};

async function mockFetch(path: string, init: any) {
  if (path === '/api/orgs/1/people/1' && init === undefined) {
    return new Response(
      JSON.stringify({
        data: mockPerson(),
      })
    );
  }

  if (path === '/api/orgs/1/people/1/tags' && init === undefined) {
    return new Response('[]');
  }

  if (path === '/api/orgs/1/people/fields' && init === undefined) {
    return new Response(
      JSON.stringify({
        data: [],
      })
    );
  }

  throw new Error(
    `unmocked request to path: '${path}'
    with init: ${JSON.stringify(init)}`
  );
}

class MockApiClient extends FetchApiClient {
  constructor() {
    super(mockFetch);
  }
}

export const decorators: Decorator[] = [
  (Story) => {
    const isDark = useStorybookDarkMode();
    const theme = useMemo(
      () =>
        isDark ? createTheme(newTheme, { palette: darkPalette }) : newTheme,
      [isDark]
    );
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Story />
      </ThemeProvider>
    );
  },
  (Story) => {
    const store = createStore();
    const env = new Environment(new MockApiClient());

    // MUI-X license
    if (process.env.STORYBOOK_MUIX_LICENSE_KEY) {
      LicenseInfo.setLicenseKey(process.env.STORYBOOK_MUIX_LICENSE_KEY);
    }

    return (
      <ReduxProvider store={store}>
        <EnvProvider env={env}>
          <Story />
        </EnvProvider>
      </ReduxProvider>
    );
  },
  (Story) => (
    <I18nProvider>
      <Story />
    </I18nProvider>
  ),
];

const darkTheme = {
  ...themes.dark,
  appBg: 'black',
  barBg: 'black',
  appContentBg: 'black',
  appPreviewBg: 'black',
} as ThemeVars;

const lightTheme = { ...themes.normal } as ThemeVars;

export const parameters = {
  backgrounds: {
    disabled: true,
  },
  darkMode: {
    dark: darkTheme,
    light: lightTheme,
    current: 'light',
    userHasExplicitlySetTheTheme: true,
  },
  docs: {
    container: (props: PropsWithChildren<DocsContainerProps>) => {
      const isDark = useStorybookDarkMode();
      const theme = isDark ? darkTheme : lightTheme;

      return <DocsContainer {...props} theme={theme} />;
    },
    theme: lightTheme,
  },
  options: {
    storySort: {
      order: ['Components'],
    },
  },
  nextjs: {
    router: {
      query: {
        orgId: 1,
        personId: 1,
      },
    },
  },
};
export const tags = ['autodocs'];
