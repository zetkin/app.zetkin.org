import { Surfing } from '@mui/icons-material';
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
    icon: Surfing,
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    icon: Surfing,
    variant: 'secondary',
  },
};

export const Tertiary: Story = {
  args: {
    icon: Surfing,
    variant: 'tertiary',
  },
};

export const Warning: Story = {
  args: {
    icon: Surfing,
    variant: 'warning',
  },
};

export const Destructive: Story = {
  args: {
    icon: Surfing,
    variant: 'destructive',
  },
};

export const Loading: Story = {
  args: {
    icon: Surfing,
    variant: 'loading',
  },
};
