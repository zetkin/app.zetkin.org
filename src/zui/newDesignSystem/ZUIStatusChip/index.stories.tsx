import { Meta, StoryObj } from '@storybook/react';

import ZUIStatusChip from './index';

const meta: Meta<typeof ZUIStatusChip> = {
  component: ZUIStatusChip,
  title: 'New Design System/ZUIStatusChip',
};
export default meta;

type Story = StoryObj<typeof ZUIStatusChip>;

export const Draft: Story = {
  args: {
    status: 'draft',
  },
};

export const Scheduled: Story = {
  args: {
    status: 'scheduled',
  },
};

export const Published: Story = {
  args: {
    status: 'published',
  },
};

export const Cancelled: Story = {
  args: {
    status: 'cancelled',
  },
};

export const Closed: Story = {
  args: {
    status: 'closed',
  },
};

export const Ended: Story = {
  args: {
    status: 'ended',
  },
};
