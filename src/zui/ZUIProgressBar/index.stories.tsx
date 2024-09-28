import { Meta, StoryObj } from '@storybook/react';

import ZUIProgressBar from './index';

const meta: Meta<typeof ZUIProgressBar> = {
  component: ZUIProgressBar,
};
export default meta;

type Story = StoryObj<typeof ZUIProgressBar>;

export const Primary: Story = {
  args: {
    progress: 25,
    size: 'medium',
  },
};

export const ThreeSegments: Story = {
  args: {
    progress: [25, 25],
    size: 'medium',
  },
};

export const FourSegments: Story = {
  args: {
    progress: [33, 33, 10],
    size: 'medium',
  },
};

export const ExtraSmall: Story = {
  args: {
    progress: [33, 33, 10],
    size: 'extraSmall',
  },
};

export const Small: Story = {
  args: {
    progress: [33, 33, 10],
    size: 'small',
  },
};

export const Large: Story = {
  args: {
    progress: [33, 33, 10],
    size: 'large',
  },
};

export const NoProgress: Story = {
  args: {
    progress: 0,
    size: 'medium',
  },
};
