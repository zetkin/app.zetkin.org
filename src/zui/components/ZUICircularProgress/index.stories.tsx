import { Meta, StoryObj } from '@storybook/react';
import ZUICircularProgress from './index';

const meta: Meta<typeof ZUICircularProgress> = {
  component: ZUICircularProgress,
  title: 'Components/ZUICircularProgress',
};

export default meta;
type Story = StoryObj<typeof ZUICircularProgress>;

export const Small: Story = {
  args: {
    size: 'small',
  },
};

export const Medium: Story = {
  args: {
    size: 'medium',
  },
};
