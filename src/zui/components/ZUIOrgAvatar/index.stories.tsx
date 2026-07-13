import { Meta, StoryObj } from '@storybook/nextjs';

import ZUIOrgAvatar from './index';

const meta: Meta<typeof ZUIOrgAvatar> = {
  component: ZUIOrgAvatar,
  title: 'Components/ZUIOrgAvatar',
};
export default meta;

type Story = StoryObj<typeof ZUIOrgAvatar>;

export const Medium: Story = {
  args: {
    orgId: 1,
    title: 'My Organization',
  },
};

export const Small: Story = {
  args: {
    orgId: 2,
    size: 'small',
    title: 'Sozialists',
  },
};

export const Large: Story = {
  args: {
    orgId: 3,
    size: 'large',
    title: 'Party with very long title',
  },
};
