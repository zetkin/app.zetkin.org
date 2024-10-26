import { Typography } from '@mui/material';
import { Meta, StoryFn } from '@storybook/react';

import mockPerson from 'utils/testing/mocks/mockPerson';
import ZUIPersonLink from '.';

export default {
  component: ZUIPersonLink,
  title: 'Old/ZUIPersonLink',
} as Meta<typeof ZUIPersonLink>;

const Template: StoryFn<typeof ZUIPersonLink> = (args) => (
  <Typography component={'div'}>
    <ZUIPersonLink person={args.person} />
  </Typography>
);

export const basic = Template.bind({});
basic.args = {
  person: mockPerson(),
};
