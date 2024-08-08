import { Meta, StoryObj } from '@storybook/react';

import ZUIMenuList from './index';

const meta: Meta<typeof ZUIMenuList> = {
  component: ZUIMenuList,
};
export default meta;

type Story = StoryObj<typeof ZUIMenuList>;

export const Basic: Story = {
  args: {
    menuItems: [
      { label: 'Event', onClick: () => null },
      { label: 'Email', onClick: () => null },
    ],
  },
};
