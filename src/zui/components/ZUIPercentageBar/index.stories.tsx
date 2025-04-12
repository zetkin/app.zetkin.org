import { Meta, StoryObj } from '@storybook/react';

import ZUIPercentageBar from './index';

const meta: Meta<typeof ZUIPercentageBar> = {
  component: ZUIPercentageBar,
  title: 'Components/ZUIPercentageBar',
};
export default meta;

type Story = StoryObj<typeof ZUIPercentageBar>;

export const TwoSegments: Story = {
  args: {
    values: [25],
  },
};

export const ThreeSegments: Story = {
  args: {
    values: [25, 25],
  },
};

export const FourSegments: Story = {
  args: {
    values: [33, 33, 10],
  },
};

export const Small: Story = {
  args: {
    size: 'small',
    values: [33, 33, 10],
  },
};

export const Medium: Story = {
  args: {
    values: [33, 33, 10],
  },
};

export const Large: Story = {
  args: {
    size: 'large',
    values: [33, 33, 10],
  },
};
