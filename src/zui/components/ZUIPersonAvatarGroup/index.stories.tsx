import { Meta, StoryObj } from '@storybook/react';

import ZUIPersonAvatarGroup from './index';

const meta: Meta<typeof ZUIPersonAvatarGroup> = {
  component: ZUIPersonAvatarGroup,
  title: 'Components/ZUIPersonAvatarGroup',
};
export default meta;

type Story = StoryObj<typeof ZUIPersonAvatarGroup>;

export const Basic: Story = {
  args: {
    avatars: [
      { firstName: 'Angela', id: 1, lastName: 'Davis' },
      { firstName: 'Assata', id: 2, lastName: 'Shakur' },
      { firstName: 'Maya', id: 3, lastName: 'Angelou' },
      { firstName: 'Toni', id: 4, lastName: 'Morrison' },
      { firstName: 'Alice', id: 5, lastName: 'Walker' },
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
