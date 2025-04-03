import { Meta, StoryObj } from '@storybook/react';
import { Surfing } from '@mui/icons-material';

import ZUIIconLabel from './index';

const meta: Meta<typeof ZUIIconLabel> = {
  component: ZUIIconLabel,
  title: 'Components/ZUIIconLabel',
};
export default meta;

type Story = StoryObj<typeof ZUIIconLabel>;

export const Medium: Story = {
  args: {
    icon: Surfing,
    label: 'Surfing',
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
