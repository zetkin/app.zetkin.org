import { Meta, StoryObj } from '@storybook/react';

import ZUIAvatar from './index';

const meta: Meta<typeof ZUIAvatar> = {
  component: ZUIAvatar,
  title: 'Components/ZUIAvatar',
};

export default meta;
type Story = StoryObj<typeof ZUIAvatar>;

export const Small: Story = {
  args: {
    id: 1,
    size: 'small',
    text: 'Angela Davis',
    variant: 'circular',
  },
};

export const Medium: Story = {
  args: {
    id: 1,
    size: 'medium',
    text: 'Angela Davis',
    variant: 'circular',
  },
};

export const Large: Story = {
  args: {
    id: 1,
    size: 'large',
    text: 'Angela Davis',
    variant: 'circular',
  },
};

export const Circular: Story = {
  args: {
    id: 1,
    size: 'large',
    text: 'Angela Davis',
    variant: 'circular',
  },
};

export const Rounded: Story = {
  args: {
    id: 1,
    size: 'large',
    text: 'Angela Davis',
    variant: 'rounded',
  },
};
