import { CatchingPokemon } from '@mui/icons-material';
import { Meta, StoryObj } from '@storybook/react';

import ZUIMenuItem from './index';

const meta: Meta<typeof ZUIMenuItem> = {
  component: ZUIMenuItem,
};
export default meta;

type Story = StoryObj<typeof ZUIMenuItem>;

export const Basic: Story = {
  args: {
    label: 'Just a plain menu item',
  },
};

export const StartIcon: Story = {
  args: {
    label: 'With icon',
    startIcon: <CatchingPokemon />,
  },
};

export const NoGutters: Story = {
  args: {
    disableGutters: true,
    label: 'Gutters disabled',
  },
};

export const WithDivider: Story = {
  args: {
    divider: true,
    label: 'I have a divider',
  },
};

export const Dense: Story = {
  args: {
    dense: true,
    label: 'I am dense',
  },
};

export const SmallScreen: Story = {
  args: {
    label: 'More padding for small screen',
    smallScreen: true,
  },
};

export const EndContent: Story = {
  args: {
    endContent: 'Ctrl+B',
    label: 'I have stuff at the end',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    label: 'I am disabled',
  },
};
