import { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';

import ZUICheckbox from '.';

export default {
  component: ZUICheckbox,
  title: 'ZUICheckbox',
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
    label: 'Do laundry',
    size: 'medium',
  },
  render: Base.render,
};

export const Small: Story = {
  args: {
    checked: false,
    label: 'Pick outfit for party',
    size: 'small',
  },
  render: Base.render,
};

export const Large: Story = {
  args: {
    checked: false,
    label: 'March to beat of own drum',
    size: 'large',
  },
  render: Base.render,
};

export const Disabled: Story = {
  args: {
    checked: false,
    disabled: true,
    label: 'Go to meeting',
    size: 'small',
  },
  render: Base.render,
};
