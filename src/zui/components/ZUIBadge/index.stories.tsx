import { Box } from '@mui/material';
import { Meta, StoryObj } from '@storybook/react';

import ZUIBadge from './index';

const meta: Meta<typeof ZUIBadge> = {
  component: ZUIBadge,
  title: 'Components/ZUIBadge',
};
export default meta;

type Story = StoryObj<typeof ZUIBadge>;

export const Basic: Story = {
  args: {
    children: <Box bgcolor="lightblue" height="30px" width="30px" />,
    color: 'success',
    number: 3,
  },
};

export const TruncatedNumber: Story = {
  args: {
    children: <Box bgcolor="lightblue" height="30px" width="30px" />,
    color: 'info',
    number: 1000,
    truncateLargeNumber: true,
  },
};

export const NegativeNumber: Story = {
  args: {
    children: <Box bgcolor="lightblue" height="30px" width="30px" />,
    color: 'danger',
    number: -15,
  },
};

export const LargeNumber: Story = {
  args: {
    children: <Box bgcolor="lightblue" height="30px" width="30px" />,
    color: 'primary',
    number: 999,
  },
};
