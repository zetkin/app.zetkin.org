import { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import ZUISwitch from './index';

const meta: Meta<typeof ZUISwitch> = {
  component: ZUISwitch,
};
export default meta;

type Story = StoryObj<typeof ZUISwitch>;

export const Default: Story = {
  args: {
    checked: false,
    size: 'medium',
  },
  render: function Render(args) {
    const [checked, setChecked] = useState(args.checked);
    return (
      <ZUISwitch
        checked={checked}
        onChange={() => setChecked(!checked)}
        size={args.size}
      />
    );
  },
};

export const UncheckedSmall: Story = {
  args: {
    checked: false,
    size: 'small',
  },
  render: Default.render,
};

export const CheckedMedium: Story = {
  args: {
    checked: true,
    size: 'medium',
  },
  render: Default.render,
};

export const CheckedSmall: Story = {
  args: {
    checked: true,
    size: 'small',
  },
  render: Default.render,
};
