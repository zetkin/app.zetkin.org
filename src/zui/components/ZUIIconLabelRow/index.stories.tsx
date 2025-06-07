import { Meta, StoryObj } from '@storybook/react';
import { Event, People, PentagonOutlined } from '@mui/icons-material';

import ZUIIconLabelRow from './index';

const meta: Meta<typeof ZUIIconLabelRow> = {
  component: ZUIIconLabelRow,
  title: 'Components/ZUIIconLabelRow',
};
export default meta;

type Story = StoryObj<typeof ZUIIconLabelRow>;

export const Medium: Story = {
  args: {
    iconLabels: [
      {
        icon: People,
        label: '13 assignees',
      },
      {
        icon: PentagonOutlined,
        label: '5 areas',
      },
      {
        icon: Event,
        label: 'April 15, 13.00-17.00',
      },
    ],
  },
};

export const Small: Story = {
  args: { ...Medium.args, size: 'small' },
};

export const Large: Story = {
  args: { ...Medium.args, size: 'large' },
};

export const Secondary: Story = {
  args: { ...Medium.args, color: 'secondary' },
};

export const Error: Story = {
  args: { ...Medium.args, color: 'error' },
};
