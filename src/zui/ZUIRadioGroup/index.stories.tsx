import { Meta, StoryObj } from '@storybook/react';

import ZUIRadioGroup from './index';

const meta: Meta<typeof ZUIRadioGroup> = {
  component: ZUIRadioGroup,
};
export default meta;

type Story = StoryObj<typeof ZUIRadioGroup>;

export const Primary: Story = {
  args: {
    defaultValue: 'swe',
    direction: 'column',
    formLabel: 'Example Form',
    helperText: 'Helper text',
    labelPlacement: 'end',
    name: 'group',
    options: [
      { name: 'Sweden', value: 'swe' },
      { name: 'Finland', value: 'fin' },
      { name: 'Norway', value: 'nor' },
      { name: 'Denmark', value: 'den' },
    ],
    size: 'small',
  },
};

export const Disabled: Story = {
  args: {
    defaultValue: 'swe',
    direction: 'column',
    disabled: true,
    formLabel: 'Example Form',
    labelPlacement: 'end',
    name: 'group',
    options: [
      { name: 'Sweden', value: 'swe' },
      { name: 'Finland', value: 'fin' },
      { name: 'Norway', value: 'nor' },
      { name: 'Denmark', value: 'den' },
    ],
    size: 'small',
  },
};

export const OneDisabledOption: Story = {
  args: {
    defaultValue: 'swe',
    direction: 'column',
    formLabel: 'Example Form',
    labelPlacement: 'end',
    name: 'group',
    options: [
      { name: 'Sweden', value: 'swe' },
      { disabled: true, name: 'Finland', value: 'fin' },
    ],
    size: 'small',
  },
};
