import { Meta, StoryObj } from '@storybook/react';
import { Box, Button } from '@mui/material';

import ZUITooltip from './index';

const meta: Meta<typeof ZUITooltip> = {
  component: ZUITooltip,
};
export default meta;

type Story = StoryObj<typeof ZUITooltip>;

export const Basic: Story = {
  args: {
    arrow: 'Down',
    children: <Button>Hover me</Button>,
    label: 'A tiny tooltip',
  },
  render: function Render(args) {
    return (
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          height: 400,
          justifyContent: 'center',
          width: 400,
        }}
      >
        <ZUITooltip {...args} />
      </Box>
    );
  },
};

export const None: Story = {
  args: {
    arrow: 'None',
    children: <Button>Hover me</Button>,
    label: 'A tiny tooltip',
  },
  render: Basic.render,
};

export const Down: Story = {
  args: {
    arrow: 'Down',
    children: <Button>Hover me</Button>,
    label: 'A tiny tooltip',
  },
  render: Basic.render,
};

export const Up: Story = {
  args: {
    arrow: 'Up',
    children: <Button>Hover me</Button>,
    label: 'A tiny tooltip',
  },
  render: Basic.render,
};

export const Left: Story = {
  args: {
    arrow: 'Left',
    children: <Button>Hover me</Button>,
    label: 'A tiny tooltip',
  },
  render: Basic.render,
};

export const Right: Story = {
  args: {
    arrow: 'Right',
    children: <Button>Hover me</Button>,
    label: 'A tiny tooltip',
  },
  render: Basic.render,
};
