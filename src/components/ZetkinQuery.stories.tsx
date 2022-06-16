import { ComponentMeta, ComponentStory } from '@storybook/react';
import { LinearProgress, Typography } from '@material-ui/core';

import mockUseQueryResult from 'utils/testing/mocks/mockUseQueryResult';
import ZetkinQuery from './ZetkinQuery';

export default {
  component: ZetkinQuery,
  title: 'Atoms/ZetkinQuery',
} as ComponentMeta<typeof ZetkinQuery>;

const Template: ComponentStory<typeof ZetkinQuery> = (args) => (
  <ZetkinQuery
    errorIndicator={args.errorIndicator}
    loadingIndicator={args.loadingIndicator}
    queries={args.queries}
  >
    {args.children}
  </ZetkinQuery>
);

const mockLoadingQuery = mockUseQueryResult('loading');
const mockErrorQuery = mockUseQueryResult('error');
const mockSuccessQuery = mockUseQueryResult('success');

export const loading = Template.bind({});
loading.args = {
  queries: { mockLoadingQuery },
};

export const customLoading = Template.bind({});
customLoading.args = {
  loadingIndicator: <LinearProgress />,
  queries: { mockLoadingQuery },
};

export const customError = Template.bind({});
customError.args = {
  errorIndicator: <Typography>THIS IS A CUSTOM ERROR!!!</Typography>,
  queries: { mockErrorQuery },
};

export const defaultError = Template.bind({});
defaultError.args = {
  queries: { mockErrorQuery },
};

export const success = Template.bind({});
success.args = {
  children: <Typography>I am a successfully resolved query.</Typography>,
  queries: { mockSuccessQuery },
};
