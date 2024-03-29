import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { IntlProvider } from 'react-intl';
import isoWeek from 'dayjs/plugin/isoWeek';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { muiTheme } from 'storybook-addon-material-ui5';
import { RouterContext } from 'next/dist/shared/lib/router-context'; // next 11.1
import withMock from 'storybook-addon-mock';
import { Provider as ReduxProvider } from 'react-redux';

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

export const decorators = [
  muiTheme([theme]),
  (story) => <ReduxProvider store={createStore()}>{story()}</ReduxProvider>,
  (story) => <I18nProvider>{story()}</I18nProvider>,
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
