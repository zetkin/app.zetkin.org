import { CatchingPokemon, ExpandMore } from '@mui/icons-material';
import { Meta, StoryObj } from '@storybook/react';

import ZUIButton from './index';

const meta: Meta<typeof ZUIButton> = {
  component: ZUIButton,
};
export default meta;

type Story = StoryObj<typeof ZUIButton>;

export const Primary: Story = {
  args: {
    label: 'Primary',
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    label: 'Secondary',
    variant: 'secondary',
  },
};

export const Tertiary: Story = {
  args: {
    label: 'Tertiary',
    variant: 'tertiary',
  },
};

export const Warning: Story = {
  args: {
    label: 'Warning',
    variant: 'warning',
  },
};

export const Destructive: Story = {
  args: {
    label: 'Destructive',
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
    label: 'Start icon',
    startIcon: <CatchingPokemon />,
    variant: 'primary',
  },
};

export const EndIcon: Story = {
  args: {
    endIcon: <ExpandMore />,
    label: 'End icon',
    variant: 'primary',
  },
};
