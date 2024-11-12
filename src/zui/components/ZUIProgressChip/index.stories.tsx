import { Meta, StoryObj } from '@storybook/react';

import ZUIProgressChip from './index';

const meta: Meta<typeof ZUIProgressChip> = {
  component: ZUIProgressChip,
  title: 'Components/ZUIProgressChip',
};
export default meta;

type Story = StoryObj<typeof ZUIProgressChip>;

export const TwoSmall: Story = {
  args: {
    values: [243, 2934],
  },
};

export const ThreeSmall: Story = {
  args: {
    values: [243, 2934, 3948],
  },
};

export const FourSmall: Story = {
  args: {
    values: [1, 2934, 34, 349],
  },
};

export const TwoMedium: Story = {
  args: {
    size: 'medium',
    values: [243, 2934],
  },
};

export const ThreeMedium: Story = {
  args: {
    size: 'medium',
    values: [243, 2934, 3948],
  },
};

export const FourMedium: Story = {
  args: {
    size: 'medium',
    values: [1, 2934, 34, 349],
  },
};
