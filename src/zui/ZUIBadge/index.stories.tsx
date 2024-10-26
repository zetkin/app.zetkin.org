import { Meta, StoryObj } from '@storybook/react';

import ZUIBadge from './index';

const meta: Meta<typeof ZUIBadge> = {
  component: ZUIBadge,
  title: 'Old/ZUIBadge',
};
export default meta;

type Story = StoryObj<typeof ZUIBadge>;

export const Published: Story = {
  args: {
    number: undefined,
    status: 'published',
  },
};

export const Draft: Story = {
  args: {
    number: 3,
    status: 'draft',
  },
};

export const Scheduled: Story = {
  args: {
    number: 1000,
    status: 'scheduled',
    truncateLargeNumber: true,
  },
};

export const Cancelled: Story = {
  args: {
    number: -15,
    status: 'cancelled',
  },
};

export const Closed: Story = {
  args: {
    number: undefined,
    status: 'closed',
  },
};

export const Ended: Story = {
  args: {
    number: 999,
    status: 'ended',
  },
};
