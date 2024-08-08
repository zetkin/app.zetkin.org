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
    type: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    label: 'Secondary',
    type: 'secondary',
  },
};

export const Tertiary: Story = {
  args: {
    label: 'Tertiary',
    type: 'tertiary',
  },
};

export const Warning: Story = {
  args: {
    label: 'Warning',
    type: 'warning',
  },
};

export const Destructive: Story = {
  args: {
    label: 'Destructive',
    type: 'destructive',
  },
};

export const Loading: Story = {
  args: {
    label: 'Loading',
    type: 'loading',
  },
};

export const StartIcon: Story = {
  args: {
    label: 'Start icon',
    startIcon: <CatchingPokemon />,
    type: 'primary',
  },
};

export const EndIcon: Story = {
  args: {
    endIcon: <ExpandMore />,
    label: 'End icon',
    type: 'primary',
  },
};
