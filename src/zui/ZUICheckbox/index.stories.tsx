import { Meta, StoryObj } from '@storybook/react';

import ZUICheckbox from '.';

export default {
  component: ZUICheckbox,
  title: 'Atoms/ZUICheckbox',
} as Meta<typeof ZUICheckbox>;

type Story = StoryObj<typeof ZUICheckbox>;

export const basic: Story = {
  args: {
    checked: true,
    size: 'small',
  },
};
