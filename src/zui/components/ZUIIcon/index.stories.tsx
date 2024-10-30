import { Meta, StoryObj } from '@storybook/react';
import { Surfing } from '@mui/icons-material';

import ZUIIcon from './index';

const meta: Meta<typeof ZUIIcon> = {
  component: ZUIIcon,
  title: 'Components/ZUIIcon',
};
export default meta;

type Story = StoryObj<typeof ZUIIcon>;

export const Medium: Story = {
  args: {
    icon: Surfing,
  },
};

export const Small: Story = {
  args: {
    icon: Surfing,
    size: 'small',
  },
};

export const Large: Story = {
  args: {
    icon: Surfing,
    size: 'large',
  },
};
