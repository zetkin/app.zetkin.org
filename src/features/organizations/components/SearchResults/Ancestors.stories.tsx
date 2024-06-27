import { Meta, StoryFn } from '@storybook/react';

import Ancestors from './Ancestors';
import { Box } from '@mui/material';

export default {
  component: Ancestors,
  title: 'Ancestors',
} as Meta<typeof Ancestors>;

const Template: StoryFn<typeof Ancestors> = (args) => (
  <Box width="100%">
    <Ancestors ancestors={args.ancestors} />
  </Box>
);

export const basic = Template.bind({});
basic.args = {
  ancestors: [
    {
      children: [],
      id: 34,
      parent: null,
      title: 'Organization',
    },
    {
      children: [],
      id: 15,
      parent: null,
      title: 'A long name of ancestor',
    },
    {
      children: [],
      id: 46,
      parent: null,
      title: 'Parent org',
    },
  ],
};
