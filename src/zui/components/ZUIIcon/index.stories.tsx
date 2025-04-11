import { Meta, StoryObj } from '@storybook/react';
import { Event } from '@mui/icons-material';

import ZUIIcon from './index';

const meta: Meta<typeof ZUIIcon> = {
  component: ZUIIcon,
  title: 'Components/ZUIIcon',
};
export default meta;

type Story = StoryObj<typeof ZUIIcon>;

export const Medium: Story = {
  args: {
    icon: Event,
  },
};

export const Small: Story = {
  args: {
    icon: Event,
    size: 'small',
  },
};

export const Large: Story = {
  args: {
    icon: Event,
    size: 'large',
  },
};
