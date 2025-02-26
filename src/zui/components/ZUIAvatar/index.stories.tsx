import { Meta, StoryObj } from '@storybook/react';

import ZUIAvatar from './index';

const meta: Meta<typeof ZUIAvatar> = {
  component: ZUIAvatar,
  title: 'Components/ZUIAvatar',
};

export default meta;
type Story = StoryObj<typeof ZUIAvatar>;

export const Medium: Story = {
  args: {
    firstName: 'Angela',
    id: 1,
    lastName: 'Davis',
  },
};

export const Small: Story = {
  args: {
    ...Medium.args,
    size: 'small',
  },
};

export const Large: Story = {
  args: {
    ...Medium.args,
    size: 'large',
  },
};

export const Square: Story = {
  args: {
    ...Medium.args,
    variant: 'square',
  },
};
