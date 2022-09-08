import { Typography } from '@material-ui/core';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import mockPerson from 'utils/testing/mocks/mockPerson';
import PersonLink from '.';

export default {
  component: PersonLink,
  title: 'Atoms/ZetkinPersonLink',
} as ComponentMeta<typeof PersonLink>;

const Template: ComponentStory<typeof PersonLink> = (args) => (
  <Typography>
    <PersonLink person={args.person} />
  </Typography>
);

export const basic = Template.bind({});
basic.args = {
  person: mockPerson(),
};
