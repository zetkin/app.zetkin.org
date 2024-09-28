import { Meta, StoryObj } from '@storybook/react';
import { Button } from '@mui/material';

import ZUITooltip from './index';

const meta: Meta<typeof ZUITooltip> = {
  component: ZUITooltip,
};
export default meta;

type Story = StoryObj<typeof ZUITooltip>;

export const Default: Story = {
  args: {
    children: <Button>Hover me</Button>,
    label: 'A tiny tooltip default',
  },
};

export const None: Story = {
  args: {
    arrow: 'None',
    children: <Button>Hover me</Button>,
    label: 'A tiny tooltip with no arrow',
  },
};

export const Down: Story = {
  args: {
    arrow: 'Down',
    children: <Button>Hover me</Button>,
    label: 'A tiny tooltip with down arrow',
  },
};

export const Up: Story = {
  args: {
    arrow: 'Up',
    children: <Button>Hover me</Button>,
    label: 'A tiny tooltip with up arrow',
  },
};

export const Left: Story = {
  args: {
    arrow: 'Left',
    children: <Button>Hover me</Button>,
    label: 'A tiny tooltip with left arrow',
  },
};

export const Right: Story = {
  args: {
    arrow: 'Right',
    children: <Button>Hover me</Button>,
    label: 'A tiny tooltip with left arrow',
  },
};
