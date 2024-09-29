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
      { name: 'Sweden', value: 'swe' },
      { name: 'Finland', value: 'fin' },
      { name: 'Norway', value: 'nor' },
      { name: 'Denmark', value: 'den' },
    ],
    labelPlacement: 'end',
    name: 'group',
    direction: 'column',
    size: 'small',
    formLabel: 'Example Form',
    defaultValue: 'swe',
    helperText: 'Helper text',
  },
};

export const Disabled: Story = {
  args: {
    options: [
      { name: 'Sweden', value: 'swe' },
      { name: 'Finland', value: 'fin' },
      { name: 'Norway', value: 'nor' },
      { name: 'Denmark', value: 'den' },
    ],
    labelPlacement: 'end',
    name: 'group',
    direction: 'column',
    size: 'small',
    formLabel: 'Example Form',
    defaultValue: 'swe',
    disabled: true,
  },
};

export const OneDisabledOption: Story = {
  args: {
    options: [
      { name: 'Sweden', value: 'swe' },
      { name: 'Finland', value: 'fin', disabled: true },
    ],
    labelPlacement: 'end',
    name: 'group',
    direction: 'column',
    size: 'small',
    formLabel: 'Example Form',
    defaultValue: 'swe',
  },
};
