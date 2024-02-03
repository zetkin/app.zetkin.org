import { Typography } from '@mui/material';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import mockPerson from 'utils/testing/mocks/mockPerson';
import ZUIPersonLink from '.';

export default {
  component: ZUIPersonLink,
  title: 'Atoms/ZetkinPersonLink',
} as ComponentMeta<typeof ZUIPersonLink>;

const Template: ComponentStory<typeof ZUIPersonLink> = (args) => (
  <Typography>
    <ZUIPersonLink person={args.person} />
  </Typography>
);

export const basic = Template.bind({});
basic.args = {
  person: mockPerson(),
};
