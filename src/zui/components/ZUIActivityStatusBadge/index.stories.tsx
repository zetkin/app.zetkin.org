import { Meta, StoryObj } from '@storybook/react';

import ZUIActivityStatusBadge from './index';

const meta: Meta<typeof ZUIActivityStatusBadge> = {
  component: ZUIActivityStatusBadge,
  title: 'Components/ZUIActivityStatusBadge',
};
export default meta;

type Story = StoryObj<typeof ZUIActivityStatusBadge>;

export const Basic: Story = {
  args: {
    status: 'cancelled',
  },
};
