import { Box } from '@mui/material';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import ProceduralColorIcon from '.';

export default {
  component: ProceduralColorIcon,
  title: 'ProceduralColorIcon',
} as ComponentMeta<typeof ProceduralColorIcon>;

const Template: ComponentStory<typeof ProceduralColorIcon> = (args) => (
  <Box display="flex">
    <ProceduralColorIcon id={args.id} />
  </Box>
);

export const basic = Template.bind({});
basic.args = {
  id: 234,
};
