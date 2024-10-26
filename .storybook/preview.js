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
import { useRouter } from 'next/router';

import { newTheme } from '../src/theme';
import '../src/styles.css';
import mockPerson from '../src/utils/testing/mocks/mockPerson';
import createStore from '../src/core/store';

dayjs.extend(isoWeek);

const I18nProvider = (props) => {
  return (
    <IntlProvider defaultLocale="en" locale="en" messages={{}}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        {props.children}
      </LocalizationProvider>
    </IntlProvider>
  );
};

async function mockFetch(path, init) {
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
  (story) => <ThemeProvider theme={newTheme}>{story()}</ThemeProvider>,
  (Story) => {
    const store = createStore();
    const router = useRouter();
    const env = new Environment(store, new MockApiClient(), router);
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
