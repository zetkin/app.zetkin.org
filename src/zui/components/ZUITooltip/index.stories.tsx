import { Meta, StoryObj } from '@storybook/react';
import { Box, Button } from '@mui/material';

import ZUITooltip from './index';

const meta: Meta<typeof ZUITooltip> = {
  component: ZUITooltip,
  title: 'New Design System/ZUITooltip',
};
export default meta;

type Story = StoryObj<typeof ZUITooltip>;

const Base: Story = {
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

export const Top: Story = {
  args: {
    arrow: true,
    children: <Button>Hover me</Button>,
    label: 'A tiny tooltip',
    placement: 'top',
  },
  render: Base.render,
};

export const NoArrow: Story = {
  args: {
    arrow: false,
    children: <Button>Hover me</Button>,
    label: 'A tiny tooltip',
    placement: 'top',
  },
  render: Base.render,
};

export const Bottom: Story = {
  args: {
    arrow: true,
    children: <Button>Hover me</Button>,
    label: 'A tiny tooltip',
    placement: 'bottom',
  },
  render: Base.render,
};

export const Left: Story = {
  args: {
    arrow: true,
    children: <Button>Hover me</Button>,
    label: 'A tiny tooltip',
    placement: 'start',
  },
  render: Base.render,
};

export const Right: Story = {
  args: {
    arrow: true,
    children: <Button>Hover me</Button>,
    label: 'A tiny tooltip',
    placement: 'end',
  },
  render: Base.render,
};
