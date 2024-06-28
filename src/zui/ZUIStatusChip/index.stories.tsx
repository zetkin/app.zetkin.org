import { Meta, StoryObj } from '@storybook/react';

import ZUIStatusChip from './index';

const meta: Meta<typeof ZUIStatusChip> = {
  component: ZUIStatusChip,
};
export default meta;

type Story = StoryObj<typeof ZUIStatusChip>;

export const Draft: Story = {
  args: {
    label: 'Draft',
    status: 'draft',
  },
};

export const Scheduled: Story = {
  args: {
    label: 'Scheduled',
    status: 'scheduled',
  },
};

export const Published: Story = {
  args: {
    label: 'Open',
    status: 'published',
  },
};

export const Cancelled: Story = {
  args: {
    label: 'Cancelled',
    status: 'cancelled',
  },
};

export const Expired: Story = {
  args: {
    label: 'Ended',
    status: 'expired',
  },
};
