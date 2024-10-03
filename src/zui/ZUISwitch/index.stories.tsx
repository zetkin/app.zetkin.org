import { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import ZUISwitch from './index';

const meta: Meta<typeof ZUISwitch> = {
  component: ZUISwitch,
};
export default meta;

type Story = StoryObj<typeof ZUISwitch>;

const Base: Story = {
  args: {
    checked: false,
    size: 'medium',
  },
  render: function Render(args) {
    const [checked, setChecked] = useState(args.checked);
    return (
      <ZUISwitch
        checked={checked}
        disabled={args.disabled}
        label={args.label}
        onChange={(newCheckedState) => setChecked(newCheckedState)}
        size={args.size}
      />
    );
  },
};

export const Medium: Story = {
  args: {
    checked: true,
    label: 'Confetti rain',
    size: 'medium',
  },
  render: Base.render,
};

export const Small: Story = {
  args: {
    checked: false,
    label: 'Subtitles',
    size: 'small',
  },
  render: Base.render,
};

export const Disabled: Story = {
  args: {
    checked: false,
    disabled: true,
    label: "Party like it's 1999",
    size: 'small',
  },
  render: Base.render,
};
