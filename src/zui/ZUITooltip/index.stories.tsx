import { Meta, StoryObj } from '@storybook/react';

import ZUITooltip from './index';
import { Button } from '@mui/material';

const meta: Meta<typeof ZUITooltip> = {
    component: ZUITooltip,
};
export default meta;

type Story = StoryObj<typeof ZUITooltip>;


export const Default: Story = {
  args: {
    label: 'A tiny tooltip default',
    children: <Button>Hover me</Button>,
  },
};

export const None: Story = {
  args: {
    label: 'A tiny tooltip with no arrow',
    children: <Button>Hover me</Button>,
    arrow: 'None',
  },
};

export const Down: Story = {
  args: {
    label: 'A tiny tooltip with down arrow',
    children: <Button>Hover me</Button>,
    arrow: 'Down',
  },
};

export const Up: Story = {
  args: {
    label: 'A tiny tooltip with up arrow',
    children: <Button>Hover me</Button>,
    arrow: 'Up',
  },
};

export const Left: Story = {
  args: {
    label: 'A tiny tooltip with left arrow',
    children: <Button>Hover me</Button>,
    arrow: 'Left',
  },
};

export const Right: Story = {
  args: {
    label: 'A tiny tooltip with left arrow',
    children: <Button>Hover me</Button>,
    arrow: 'Right',
  },
};