import { Meta, StoryFn } from '@storybook/nextjs';

import ZUITimeSpan from '.';

export default {
  component: ZUITimeSpan,
  title: 'Other/ZUITimeSpan',
} as Meta<typeof ZUITimeSpan>;

const Template: StoryFn<typeof ZUITimeSpan> = (args) => {
  return <ZUITimeSpan end={args.end} start={args.start} />;
};

const now = Temporal.Now.plainDateTimeISO();

const todayAt12 = now.with({ hour: 12, minute: 0, second: 0 });

const todayAt14 = todayAt12.with({ hour: 14 });

const tomorrowAt12 = todayAt12.add({ days: 1 });

const tomorrowAt14 = todayAt14.add({ days: 1 });

const nextDayAt14 = todayAt14.add({ days: 2 });

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
