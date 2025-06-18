import { Meta, StoryObj } from '@storybook/react';
import { Box } from '@mui/material';

import ZUIGradientBackground from './index';

const meta: Meta<typeof ZUIGradientBackground> = {
  component: ZUIGradientBackground,
  title: 'Components/ZUIGradientBackground',
};
export default meta;

type Story = StoryObj<typeof ZUIGradientBackground>;

export const Basic: Story = {
  args: {
    seed: '307event',
  },
  render: function Render(args) {
    return (
      <Box height={500} width={500}>
        <ZUIGradientBackground {...args} />
      </Box>
    );
  },
};
