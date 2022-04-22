import { IntlProvider } from 'react-intl';
import { muiTheme } from 'storybook-addon-material-ui';
import withMock from 'storybook-addon-mock';
import { QueryClientProvider, QueryClient } from 'react-query';
import { RouterContext } from 'next/dist/shared/lib/router-context'; // next 11.1
import theme from '../src/theme';
import mockPerson from '../src/utils/testing/mocks/mockPerson';

const queryClient = new QueryClient();

export const decorators = [
  muiTheme([theme]),
  (story) => (
    <QueryClientProvider client={queryClient}>{story()}</QueryClientProvider>
  ),
  (story) => (
    <IntlProvider defaultLocale="en" locale="en" messages={{}}>
      {story()}
    </IntlProvider>
  ),
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
    {
      url: 'api/orgs/1/people/1/avatar',
      method: 'GET',
      status: 200,
      response: {
        data: 'Hello storybook-addon-mock!',
      },
    },
  ],
};
