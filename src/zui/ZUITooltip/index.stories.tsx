import { Meta, StoryObj } from '@storybook/react';

import ZUITooltip from './index';

const meta: Meta<typeof ZUITooltip> = {
    component: ZUITooltip,
};
export default meta;

type Story = StoryObj<typeof ZUITooltip>;

export const Default: Story = {
  args: {
    label: 'A tiny tooltip default',
  },
};

export const None: Story = {
  args: {
    label: 'A tiny tooltip with no arrow',
    arrow: 'None',
  },
};

export const Down: Story = {
  args: {
    label: 'A tiny tooltip with down arrow',
    arrow: 'Down',
  },
};

export const Up: Story = {
  args: {
    label: 'A tiny tooltip with up arrow',
    arrow: 'Up',
  },
};

export const Left: Story = {
  args: {
    label: 'A tiny tooltip with left arrow',
    arrow: 'Left',
  },
};

export const Right: Story = {
  args: {
    label: 'A tiny tooltip with left arrow',
    arrow: 'Right',
  },
};