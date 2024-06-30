import { Box } from '@mui/material';
import React from 'react';
import { Meta, StoryFn } from '@storybook/react';

import { CUSTOM_FIELD_TYPE } from 'utils/types/zetkin';
import mockOrganization from 'utils/testing/mocks/mockOrganization';
import mockPerson from 'utils/testing/mocks/mockPerson';
import PersonDetailsCard from './PersonDetailsCard';

export default {
  component: PersonDetailsCard,
  title: 'PersonDetailsCard',
} as Meta<typeof PersonDetailsCard>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: StoryFn<typeof PersonDetailsCard> = (args) => (
  <Box maxWidth="400px">
    <PersonDetailsCard {...args} />
  </Box>
);

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  customFields: [
    {
      description: null,
      id: 1,
      organization: mockOrganization(),
      slug: 'birthday',
      title: 'Birthday',
      type: CUSTOM_FIELD_TYPE.DATE,
    },
    {
      description: null,
      id: 1,
      organization: mockOrganization(),
      slug: 'facebook',
      title: 'Facebook Profile',
      type: CUSTOM_FIELD_TYPE.URL,
    },
    {
      description: null,
      id: 1,
      organization: mockOrganization(),
      slug: 'twitter',
      title: 'Twitter Profile',
      type: CUSTOM_FIELD_TYPE.URL,
    },
  ],
  person: mockPerson({
    birthday: '1970-07-01',
    facebook: 'https://facebook.com',
  }),
};
