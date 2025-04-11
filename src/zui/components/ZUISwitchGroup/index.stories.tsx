import { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';

import ZUISwitchGroup from './index';

const meta: Meta<typeof ZUISwitchGroup> = {
  component: ZUISwitchGroup,
  title: 'Components/ZUISwitchGroup',
};
export default meta;

type Story = StoryObj<typeof ZUISwitchGroup>;

export const Basic: Story = {
  args: {
    helperText: 'Applies to the whole organization.',
    label: 'Settings',
  },
  render: function Render(args) {
    const [lights, setLights] = useState({
      big: false,
      disco: false,
      reading: false,
    });

    const options = [
      {
        checked: lights.big,
        label: 'Animations',
        onChange: () =>
          setLights({
            ...lights,
            big: !lights.big,
          }),
      },
      {
        checked: lights.disco,
        label: 'Subtitles',
        onChange: () =>
          setLights({
            ...lights,
            disco: !lights.disco,
          }),
      },
      {
        checked: lights.reading,
        label: 'Sounds',
        onChange: () =>
          setLights({
            ...lights,
            reading: !lights.reading,
          }),
      },
    ];

    return (
      <ZUISwitchGroup
        {...args}
        error={args.error && !lights.reading && !lights.big && !lights.disco}
        options={options}
      />
    );
  },
};

export const Disabled: Story = {
  args: { ...Basic.args, disabled: true },
  render: Basic.render,
};

export const Error: Story = {
  args: {
    ...Basic.args,
    error: true,
  },
  render: Basic.render,
};
