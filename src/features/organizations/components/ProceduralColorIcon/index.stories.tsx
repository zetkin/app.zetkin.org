import { Box } from '@mui/material';
import { Meta, StoryFn } from '@storybook/react';

import ProceduralColorIcon from '.';

export default {
  component: ProceduralColorIcon,
  title: 'ProceduralColorIcon',
} as Meta<typeof ProceduralColorIcon>;

const Template: StoryFn<typeof ProceduralColorIcon> = (args) => (
  <Box display="flex">
    <ProceduralColorIcon id={args.id} />
  </Box>
);

export const basic = Template.bind({});
basic.args = {
  id: 234,
};
