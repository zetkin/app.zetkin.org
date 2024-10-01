import { Meta, StoryObj } from '@storybook/react';
import Box from '@mui/material/Box';

import ZUIDivider from '.';

const meta: Meta<typeof ZUIDivider> = {
  component: ZUIDivider,
};
export default meta;
type Story = StoryObj<typeof ZUIDivider>;

export const Horizontal: Story = {
  args: {
    orientation: 'horizontal',
  },
};

export const Vertical: Story = {
  args: {
    orientation: 'vertical',
  },
  decorators: [
    () => (
      <Box sx={{ display: 'flex', height: '100px' }}>
        <ZUIDivider orientation="vertical" />
      </Box>
    ),
  ],
};
