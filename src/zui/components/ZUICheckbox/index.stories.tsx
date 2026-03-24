import { useState } from 'react';
import { Meta, StoryObj } from '@storybook/nextjs';

import ZUICheckbox from '.';

export default {
  component: ZUICheckbox,
  title: 'Components/ZUICheckbox',
} as Meta<typeof ZUICheckbox>;

type Story = StoryObj<typeof ZUICheckbox>;

const Base: Story = {
  args: {
    checked: false,
    size: 'medium',
  },
  render: function Render(args) {
    const [checked, setChecked] = useState(args.checked);
    return (
      <ZUICheckbox
        {...args}
        checked={checked}
        onChange={(newCheckedState) => setChecked(newCheckedState)}
      />
    );
  },
};

export const Medium: Story = {
  args: {
    checked: true,
    label: 'I want to participate',
    size: 'medium',
  },
  render: Base.render,
};

export const Small: Story = {
  args: {
    checked: false,
    label: 'I agree',
    size: 'small',
  },
  render: Base.render,
};

export const Large: Story = {
  args: {
    checked: false,
    label: 'Yes',
    size: 'large',
  },
  render: Base.render,
};

export const Disabled: Story = {
  args: {
    checked: false,
    disabled: true,
    label: 'No',
    size: 'small',
  },
  render: Base.render,
};
