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

import theme from '../src/theme';
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

function mockFetch(path, init) {
  if (path === '/api/orgs/1/people/1' && init === undefined) {
    return Promise.resolve(
      new Response(
        JSON.stringify({
          data: mockPerson(),
        })
      )
    );
  } else if (path === '/api/orgs/1/people/1/tags' && init === undefined) {
    return Promise.resolve(new Response('[]'));
  } else {
    return Promise.reject({ error: 'unmocked request', path, init });
  }
}

class MockApiClient extends FetchApiClient {
  constructor() {
    super(mockFetch);
  }
}

export const decorators = [
  (Story) => (
    <ThemeProvider theme={theme}>
      <Story />
    </ThemeProvider>
  ),
  (story) => {
    const store = createStore();
    const router = useRouter();
    const env = new Environment(store, new MockApiClient(), router);
    return (
      <ReduxProvider store={store}>
        <EnvProvider env={env}>{story()}</EnvProvider>
      </ReduxProvider>
    );
  },
  (story) => <I18nProvider>{story()}</I18nProvider>,
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
