import { Meta, StoryObj } from '@storybook/react';

import ZUIProgressChip from './index';

const meta: Meta<typeof ZUIProgressChip> = {
  component: ZUIProgressChip,
  title: 'Components/ZUIProgressChip',
};
export default meta;

type Story = StoryObj<typeof ZUIProgressChip>;

export const Two: Story = {
  args: {
    values: [243, 2934],
  },
};

export const Three: Story = {
  args: {
    values: [243, 2934, 3948],
  },
};

export const Four: Story = {
  args: {
    values: [243, 2934, 34, 1349],
  },
};
