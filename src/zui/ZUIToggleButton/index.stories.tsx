import { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';

import ZUIToggleButton from './index';

const meta: Meta<typeof ZUIToggleButton> = {
  component: ZUIToggleButton,
};
export default meta;

type Story = StoryObj<typeof ZUIToggleButton>;

export const Basic: Story = {
  args: {
    options: [
      { label: 'Day', value: 'day' },
      { label: 'Week', value: 'week' },
      { label: 'Month', value: 'month' },
    ],
  },
  render: function Render(args) {
    const [timeScale, setTimeScale] = useState<'day' | 'week' | 'month'>(
      'week'
    );
    return (
      <ZUIToggleButton
        {...args}
        onChange={(newValue) => {
          if (
            newValue &&
            (newValue == 'day' || newValue == 'week' || newValue == 'month')
          ) {
            setTimeScale(newValue);
          }
        }}
        value={timeScale}
      />
    );
  },
};
