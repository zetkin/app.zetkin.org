import { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import ZUISwitch from './index';

const meta: Meta<typeof ZUISwitch> = {
  component: ZUISwitch,
  title: 'Components/ZUISwitch',
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
    label: 'Animations',
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
    label: 'Sound',
    size: 'small',
  },
  render: Base.render,
};
