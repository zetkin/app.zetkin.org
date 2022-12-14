import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { IntlProvider } from 'react-intl';
import isoWeek from 'dayjs/plugin/isoWeek';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { muiTheme } from 'storybook-addon-material-ui';
import { RouterContext } from 'next/dist/shared/lib/router-context'; // next 11.1
import withMock from 'storybook-addon-mock';
import { useEffect, useState } from 'react';
import { QueryClientProvider, QueryClient } from 'react-query';

import theme from '../src/theme';
import '../src/styles.css';
import mockPerson from '../src/utils/testing/mocks/mockPerson';

const queryClient = new QueryClient();

dayjs.extend(isoWeek);

const AsyncIntlProvider = (props) => {
  const [messages, setMessages] = useState({});

  // Load localized messages on first render
  useEffect(() => {
    loadMessages().then((data) => setMessages(data.messages));
  }, []);

  return (
    <IntlProvider defaultLocale="en" locale="en" messages={messages}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        {props.children}
      </LocalizationProvider>
    </IntlProvider>
  );

  async function loadMessages() {
    const res = await fetch('/l10n_messages');
    return await res.json();
  }
};

export const decorators = [
  muiTheme([theme]),
  (story) => (
    <QueryClientProvider client={queryClient}>{story()}</QueryClientProvider>
  ),
  (story) => <AsyncIntlProvider>{story()}</AsyncIntlProvider>,
  withMock,
];

export const parameters = {
  nextRouter: {
    Provider: RouterContext.Provider,
    query: {
      orgId: 1,
      personId: 1,
    },
  },
  mockData: [
    {
      url: 'api/orgs/1/people/1',
      method: 'GET',
      status: 200,
      response: {
        data: mockPerson(),
      },
    },
    {
      url: 'api/orgs/1/people/1/tags',
      method: 'GET',
      status: 200,
      response: {
        data: [],
      },
    },
  ],
};
