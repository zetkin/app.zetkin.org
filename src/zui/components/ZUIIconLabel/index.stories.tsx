import { Meta, StoryObj } from '@storybook/react';
import { Event } from '@mui/icons-material';

import ZUIIconLabel from './index';

const meta: Meta<typeof ZUIIconLabel> = {
  component: ZUIIconLabel,
  title: 'Components/ZUIIconLabel',
};
export default meta;

type Story = StoryObj<typeof ZUIIconLabel>;

export const Medium: Story = {
  args: {
    icon: Event,
    label: 'April 15th, 13.00-17.00',
  },
};

export const Small: Story = {
  args: {
    ...Medium.args,
    size: 'small',
  },
};

export const Large: Story = {
  args: {
    ...Medium.args,
    size: 'large',
  },
};

export const Secondary: Story = {
  args: {
    ...Medium.args,
    color: 'secondary',
  },
};

export const Danger: Story = {
  args: {
    ...Medium.args,
    color: 'danger',
  },
};
