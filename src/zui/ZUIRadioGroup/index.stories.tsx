import { Meta, StoryObj } from '@storybook/react';

import ZUIRadioGroup from './index';

const meta: Meta<typeof ZUIRadioGroup> = {
  component: ZUIRadioGroup,
};
export default meta;

type Story = StoryObj<typeof ZUIRadioGroup>;

export const Primary: Story = {
  args: {
    options: [
      { name: 'Sweden', value: 'Foo' },
      { name: 'Finland', value: 'Foo' },
      { name: 'Norway', value: 'Foo' },
      { name: 'Denmark', value: 'Foo' },
    ],
    labelPlacement: 'end',
    name: 'group',
    direction: 'column',
  },
};
