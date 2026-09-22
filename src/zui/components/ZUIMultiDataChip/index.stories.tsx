import { Meta, StoryObj } from '@storybook/nextjs';

import ZUIMultiDataChip from './index';

const meta: Meta<typeof ZUIMultiDataChip> = {
  component: ZUIMultiDataChip,
  title: 'Components/ZUIMultiDataChip',
};
export default meta;

type Story = StoryObj<typeof ZUIMultiDataChip>;

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
