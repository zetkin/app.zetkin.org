import { ComponentMeta, ComponentStory } from '@storybook/react';

import Ancestors from './Ancestors';
import { Box } from '@mui/material';

export default {
  component: Ancestors,
  title: 'Ancestors',
} as ComponentMeta<typeof Ancestors>;

const Template: ComponentStory<typeof Ancestors> = (args) => (
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
