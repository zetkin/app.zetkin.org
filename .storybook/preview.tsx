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
import { FC, PropsWithChildren } from 'react';
import { StoryFn } from '@storybook/react';

import theme from '../src/theme';
import '../src/styles.css';
import mockPerson from '../src/utils/testing/mocks/mockPerson';
import createStore from '../src/core/store';

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

export const decorators = [
  (Story: StoryFn) => (
    <ThemeProvider theme={theme}>
      <Story />
    </ThemeProvider>
  ),
  (Story: StoryFn) => {
    const store = createStore();
    const env = new Environment(new MockApiClient());
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

export const parameters = {
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
