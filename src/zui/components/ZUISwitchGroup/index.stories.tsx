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
    helperText: 'Make it nice and cozy.',
    label: 'Light switches',
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
        label: 'Big light',
        onChange: () =>
          setLights({
            ...lights,
            big: !lights.big,
          }),
      },
      {
        checked: lights.disco,
        label: 'Disco light',
        onChange: () =>
          setLights({
            ...lights,
            disco: !lights.disco,
          }),
      },
      {
        checked: lights.reading,
        label: 'Reading lamp',
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
  args: {
    disabled: true,
    helperText: 'You can turn on multiple lights',
    label: 'Which lights should be on',
  },
  render: Basic.render,
};

export const Error: Story = {
  args: {
    error: true,
    helperText: 'You need to pick at least one light',
    label: 'Turn on the lights',
  },
  render: Basic.render,
};
