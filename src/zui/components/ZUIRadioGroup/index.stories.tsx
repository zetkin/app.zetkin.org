import { Meta, StoryObj } from '@storybook/react';

import ZUIRadioGroup from './index';

const meta: Meta<typeof ZUIRadioGroup> = {
  component: ZUIRadioGroup,
  title: 'Components/ZUIRadioGroup',
};
export default meta;

type Story = StoryObj<typeof ZUIRadioGroup>;

export const Primary: Story = {
  args: {
    helperText: 'Helper text',
    label: 'Example Form',
    labelPlacement: 'end',
    options: [
      { label: 'Sweden', value: 'swe' },
      { label: 'Finland', value: 'fin' },
      { label: 'Norway', value: 'nor' },
      { label: 'Denmark', value: 'den' },
    ],
    size: 'small',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    helperText: 'Helper text',
    label: 'Example Form',
    labelPlacement: 'end',
    options: [
      { label: 'Sweden', value: 'swe' },
      { label: 'Finland', value: 'fin' },
      { label: 'Norway', value: 'nor' },
      { label: 'Denmark', value: 'den' },
    ],
    size: 'small',
  },
};

export const OneDisabledOption: Story = {
  args: {
    label: 'Example Form',
    labelPlacement: 'end',
    options: [
      { label: 'Sweden', value: 'swe' },
      { disabled: true, label: 'Finland', value: 'fin' },
    ],
    size: 'small',
  },
};

export const Error: Story = {
  args: {
    error: true,
    helperText: 'You need to pick one option',
    label: 'Example Form',
    labelPlacement: 'end',
    options: [
      { label: 'Sweden', value: 'swe' },
      { label: 'Finland', value: 'fin' },
      { label: 'Norway', value: 'nor' },
      { label: 'Denmark', value: 'den' },
    ],
  },
};
