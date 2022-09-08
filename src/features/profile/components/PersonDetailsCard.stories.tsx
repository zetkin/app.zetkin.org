import { Box } from '@material-ui/core';
import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import mockOrganization from 'utils/testing/mocks/mockOrganization';
import mockPerson from 'utils/testing/mocks/mockPerson';
import PersonDetailsCard from './PersonDetailsCard';

export default {
  component: PersonDetailsCard,
  title: 'Molecules/PersonDetailsCard',
} as ComponentMeta<typeof PersonDetailsCard>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof PersonDetailsCard> = (args) => (
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
      type: 'date',
    },
    {
      description: null,
      id: 1,
      organization: mockOrganization(),
      slug: 'facebook',
      title: 'Facebook Profile',
      type: 'url',
    },
    {
      description: null,
      id: 1,
      organization: mockOrganization(),
      slug: 'twitter',
      title: 'Twitter Profile',
      type: 'url',
    },
  ],
  person: mockPerson({
    birthday: '1970-07-01',
    facebook: 'https://facebook.com',
  }),
};
