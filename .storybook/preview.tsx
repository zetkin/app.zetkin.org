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
import React, {
  FC,
  PropsWithChildren,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Preview, StoryFn } from '@storybook/react';
import { DARK_MODE_EVENT_NAME, useDarkMode } from 'storybook-dark-mode';
import { addons } from '@storybook/preview-api';
import { themes, ThemeVarsColors } from '@storybook/theming';

import newTheme from '../src/zui/theme';
import '../src/styles.css';
import mockPerson from '../src/utils/testing/mocks/mockPerson';
import createStore from '../src/core/store';
import { LicenseInfo } from '@mui/x-license';
import CssBaseline from '@mui/material/CssBaseline';
import { DocsContainer } from '@storybook/blocks';

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

export const decorators: Preview['decorators'] = [
  (Story: StoryFn) => {
    const themeMode = useDarkMode();
    const theme = useMemo(
      () => newTheme(themeMode ? 'dark' : 'light'),
      [themeMode]
    );
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Story />
      </ThemeProvider>
    );
  },
  (Story: StoryFn) => {
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
  (Story: StoryFn) => (
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
} as ThemeVarsColors;

const lightTheme = { ...themes.normal } as ThemeVarsColors;

const channel = addons.getChannel();

export const parameters = {
  backgrounds: {
    disable: true,
  },
  darkMode: {
    dark: darkTheme,
    light: lightTheme,
    current: 'light',
    userHasExplicitlySetTheTheme: true,
  },
  docs: {
    container: (props) => {
      const [isDark, setDark] = useState(() => {
        const existing = localStorage.getItem('storybook-dark-mode');
        if (!existing) {
          return null;
        }
        return existing === 'true';
      });

      useEffect(() => {
        channel.on(DARK_MODE_EVENT_NAME, setDark);
        return () => channel.removeListener(DARK_MODE_EVENT_NAME, setDark);
      }, [channel, setDark]);

      useEffect(() => {
        if (isDark === null) {
          return;
        }
        localStorage.setItem('storybook-dark-mode', isDark + '');
      }, [isDark]);

      const theme = isDark ? darkTheme : lightTheme;

      if (isDark === null) {
        return null;
      }

      return <DocsContainer {...props} theme={theme} />;
    },
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
