import { Meta, StoryObj } from '@storybook/react';

import ZUIDivider from '.';

export default {
  component: ZUIDivider,
} as Meta<typeof ZUIDivider>;

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
};
