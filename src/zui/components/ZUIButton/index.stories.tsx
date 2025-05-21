import { ExpandMore, Mail } from '@mui/icons-material';
import { Meta, StoryObj } from '@storybook/react';

import ZUIButton from './index';

const meta: Meta<typeof ZUIButton> = {
  component: ZUIButton,
  title: 'Components/ZUIButton',
};
export default meta;

type Story = StoryObj<typeof ZUIButton>;

export const Primary: Story = {
  args: {
    label: 'Open',
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    label: 'Cancel',
    variant: 'secondary',
  },
};

export const Tertiary: Story = {
  args: {
    label: 'Attended',
    variant: 'tertiary',
  },
};

export const Warning: Story = {
  args: {
    label: 'Change surevy question',
    variant: 'warning',
  },
};

export const Destructive: Story = {
  args: {
    label: 'Delete person',
    variant: 'destructive',
  },
};

export const Loading: Story = {
  args: {
    label: 'Loading',
    variant: 'loading',
  },
};

export const StartIcon: Story = {
  args: {
    label: 'Send an email',
    startIcon: Mail,
    variant: 'primary',
  },
};

export const EndIcon: Story = {
  args: {
    endIcon: ExpandMore,
    label: 'Create activity',
    variant: 'primary',
  },
};

export const Href: Story = {
  args: {
    href: '#',
    label: 'Sign up!',
    variant: 'secondary',
  },
};

export const NoWrap: Story = {
  args: {
    href: '#',
    label:
      'A really looooooooooong titleeeeeee that needs to be trucaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaated',
    noWrap: true,
    variant: 'secondary',
  },
};
