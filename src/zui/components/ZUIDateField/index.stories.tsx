import { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';

import ZUIDateField from './index';
import LocaleSwitcher from '../utils/LocaleSwitcher';

const meta: Meta<typeof ZUIDateField> = {
  component: ZUIDateField,
  title: 'Components/ZUIDateField',
};
export default meta;

type Story = StoryObj<typeof ZUIDateField>;

export const Basic: Story = {
  args: { label: 'Birthday' },
  render: function Render(args) {
    const [date, setDate] = useState<Dayjs | null>(null);

    return (
      <ZUIDateField
        {...args}
        onChange={(newDate) => setDate(newDate)}
        value={date}
      />
    );
  },
};

export const WithMarkedDates: Story = {
  args: {
    ...Basic.args,
    datesToMark: [
      dayjs().add(1, 'day'),
      dayjs().add(3, 'day'),
      dayjs().add(4, 'day'),
    ],
  },
  render: Basic.render,
};

export const DisablePast: Story = {
  args: {
    ...Basic.args,
    disablePast: true,
  },
  render: Basic.render,
};

export const DifferentLocales: Story = {
  args: {
    ...Basic.args,
  },
  render: function Render(args) {
    const [date, setDate] = useState<Dayjs | null>(null);

    return (
      <LocaleSwitcher>
        <ZUIDateField
          {...args}
          onChange={(newDate) => setDate(newDate)}
          value={date}
        />
      </LocaleSwitcher>
    );
  },
};
