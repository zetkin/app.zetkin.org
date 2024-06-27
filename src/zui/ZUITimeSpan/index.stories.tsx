import { Meta, StoryFn } from '@storybook/react';

import ZUITimeSpan from '.';

export default {
  component: ZUITimeSpan,
  title: 'ZUITimeSpan',
} as Meta<typeof ZUITimeSpan>;

const Template: StoryFn<typeof ZUITimeSpan> = (args) => {
  return <ZUITimeSpan end={args.end} start={args.start} />;
};

const now = new Date();

const todayAt12 = new Date(
  now.getFullYear(),
  now.getMonth(),
  now.getDate(),
  12
);

const todayAt14 = new Date(todayAt12);
todayAt14.setHours(14);

const tomorrowAt12 = new Date(todayAt12);
tomorrowAt12.setDate(tomorrowAt12.getDate() + 1);

const tomorrowAt14 = new Date(todayAt14);
tomorrowAt14.setDate(tomorrowAt14.getDate() + 1);

const nextDayAt14 = new Date(todayAt14);
nextDayAt14.setDate(nextDayAt14.getDate() + 2);

export const today = Template.bind({});
today.args = {
  end: todayAt14,
  start: todayAt12,
};

export const tomorrow = Template.bind({});
tomorrow.args = {
  end: tomorrowAt14,
  start: tomorrowAt12,
};

export const todayAndTomorrow = Template.bind({});
todayAndTomorrow.args = {
  end: tomorrowAt12,
  start: todayAt12,
};

export const multiDay = Template.bind({});
multiDay.args = {
  end: nextDayAt14,
  start: tomorrowAt12,
};
