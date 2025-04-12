import { Close } from '@mui/icons-material';
import { Meta, StoryObj } from '@storybook/react';

import ZUIIconButton from './index';

const meta: Meta<typeof ZUIIconButton> = {
  component: ZUIIconButton,
  title: 'Components/ZUIIconButton',
};
export default meta;

type Story = StoryObj<typeof ZUIIconButton>;

export const Primary: Story = {
  args: {
    icon: Close,
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    icon: Close,
    variant: 'secondary',
  },
};

export const Tertiary: Story = {
  args: {
    icon: Close,
    variant: 'tertiary',
  },
};

export const Warning: Story = {
  args: {
    icon: Close,
    variant: 'warning',
  },
};

export const Destructive: Story = {
  args: {
    icon: Close,
    variant: 'destructive',
  },
};

export const Loading: Story = {
  args: {
    icon: Close,
    variant: 'loading',
  },
};
