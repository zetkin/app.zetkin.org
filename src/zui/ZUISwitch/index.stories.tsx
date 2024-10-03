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
        onChange={() => setChecked(!checked)}
        size={args.size}
      />
    );
  },
};

export const Medium: Story = {
  args: {
    checked: true,
    size: 'medium',
  },
  render: Base.render,
};

export const Small: Story = {
  args: {
    checked: false,
    size: 'small',
  },
  render: Base.render,
};

export const Disabled: Story = {
  args: {
    checked: false,
    disabled: true,
    size: 'small',
  },
  render: Base.render,
};
