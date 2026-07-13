import { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { DateRange as DateRangeType } from '@mui/x-date-pickers-pro';

import ZUIDatePicker from './index';
import LocaleSwitcher from '../utils/LocaleSwitcher';

const meta: Meta<typeof ZUIDatePicker> = {
  component: ZUIDatePicker,
  title: 'Components/ZUIDatePicker',
};
export default meta;

type Story = StoryObj<typeof ZUIDatePicker>;

export const SingleDate: Story = {
  render: function Render(args) {
    const [date, setDate] = useState<Dayjs | null>(null);

    return (
      <ZUIDatePicker
        {...args}
        allowRangeSelection={false}
        onChange={(newDate) => setDate(newDate)}
        value={date}
      />
    );
  },
};

export const SingleDateDisablePast: Story = {
  args: {
    disablePast: true,
  },
  render: SingleDate.render,
};

export const SingleDateWithMarkedDates: Story = {
  args: {
    datesToMark: [
      dayjs().add(1, 'day'),
      dayjs().add(3, 'day'),
      dayjs().add(4, 'day'),
    ],
  },
  render: SingleDate.render,
};

export const DateRange: Story = {
  render: function Render(args) {
    const [date, setDate] = useState<DateRangeType<Dayjs>>([null, null]);

    return (
      <ZUIDatePicker
        {...args}
        allowRangeSelection={true}
        onChange={(newDate) => setDate(newDate)}
        value={date}
      />
    );
  },
};

export const DateRangeDisablePast: Story = {
  args: {
    disablePast: true,
  },
  render: DateRange.render,
};

export const DateRangeWithMarkedDates: Story = {
  args: {
    datesToMark: [
      dayjs().add(1, 'day'),
      dayjs().add(3, 'day'),
      dayjs().add(4, 'day'),
    ],
  },
  render: DateRange.render,
};

export const DifferentLocales: Story = {
  render: function Render(args) {
    const [date, setDate] = useState<Dayjs | null>(null);

    return (
      <LocaleSwitcher>
        <ZUIDatePicker
          {...args}
          allowRangeSelection={false}
          onChange={(newDate) => setDate(newDate)}
          value={date}
        />
      </LocaleSwitcher>
    );
  },
};
