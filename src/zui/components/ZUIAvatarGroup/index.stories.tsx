import { Meta, StoryObj } from '@storybook/react';

import ZUIAvatarGroup from './index';

const meta: Meta<typeof ZUIAvatarGroup> = {
  component: ZUIAvatarGroup,
  title: 'Components/ZUIAvatarGroup',
};
export default meta;

type Story = StoryObj<typeof ZUIAvatarGroup>;

export const Basic: Story = {
  args: {
    avatars: [
      { firstName: 'Angela', id: 1, lastName: 'Davis' },
      { firstName: 'James', id: 2, lastName: 'Dean' },
      { firstName: 'Georg', id: 3, lastName: 'Schneider' },
      { firstName: 'Bernie', id: 4, lastName: 'Sanders' },
      { firstName: 'Peder', id: 5, lastName: 'Kofoed' },
    ],
  },
};

export const Max: Story = {
  args: {
    ...Basic.args,
    max: 4,
  },
};

export const Small: Story = {
  args: {
    ...Basic.args,
    max: 4,
    size: 'small',
  },
};

export const Large: Story = {
  args: {
    ...Basic.args,
    max: 3,
    size: 'large',
  },
};

export const Square: Story = {
  args: {
    ...Basic.args,
    max: 4,
    variant: 'square',
  },
};
