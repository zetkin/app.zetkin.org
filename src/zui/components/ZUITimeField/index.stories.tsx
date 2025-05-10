import { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Dayjs } from 'dayjs';

import ZUITimeField from './index';
import LocaleSwitcher from '../utils/LocaleSwitcher';

const meta: Meta<typeof ZUITimeField> = {
  component: ZUITimeField,
  title: 'Components/ZUITimeField',
};
export default meta;

type Story = StoryObj<typeof ZUITimeField>;

export const Basic: Story = {
  args: {
    label: 'Event start time',
  },
  render: function Render(args) {
    const [time, setTime] = useState<Dayjs | null>(null);

    return (
      <ZUITimeField
        {...args}
        onChange={(newTime) => setTime(newTime)}
        value={time}
      />
    );
  },
};

export const DifferentLocales: Story = {
  args: {
    label: 'Event start time',
  },
  render: function Render(args) {
    const [time, setTime] = useState<Dayjs | null>(null);

    return (
      <LocaleSwitcher>
        <ZUITimeField
          {...args}
          onChange={(newTime) => setTime(newTime)}
          value={time}
        />
      </LocaleSwitcher>
    );
  },
};
