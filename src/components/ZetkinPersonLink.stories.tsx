import { Typography } from '@material-ui/core';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import mockPerson from 'utils/testing/mocks/mockPerson';
import ZetkinPersonLink from './ZetkinPersonLink';

export default {
  component: ZetkinPersonLink,
  title: 'Atoms/ZetkinPersonLink',
} as ComponentMeta<typeof ZetkinPersonLink>;

const Template: ComponentStory<typeof ZetkinPersonLink> = (args) => (
  <Typography>
    <ZetkinPersonLink person={args.person} />
  </Typography>
);

export const basic = Template.bind({});
basic.args = {
  person: mockPerson(),
};
