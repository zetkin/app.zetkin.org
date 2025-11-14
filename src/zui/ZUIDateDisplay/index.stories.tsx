import { Meta, StoryFn } from '@storybook/react';

import ZUIDateDisplay from '.';

export default {
  component: ZUIDateDisplay,
  title: 'Other/ZUIDateDisplay',
} as Meta<typeof ZUIDateDisplay>;

const Template: StoryFn<typeof ZUIDateDisplay> = (args) => (
  <ZUIDateDisplay
    displayFormat={args.displayFormat}
    endTimestamp={args.endTimestamp}
    showRelative={args.showRelative}
    timestamp={args.timestamp}
  />
);

// slicing away the "Z" at the end of the ISO-string, because
// that's how dates are formatted coming from the backend.
export const full = Template.bind({});
full.args = {
  displayFormat: 'full',
  timestamp: new Date().toISOString().slice(0, -1),
};

export const short = Template.bind({});
short.args = {
  displayFormat: 'short',
  timestamp: new Date().toISOString().slice(0, -1),
};
export const log = Template.bind({});
log.args = {
  displayFormat: 'log',
  timestamp: new Date().toISOString().slice(0, -1),
};
export const time = Template.bind({});
time.args = {
  displayFormat: 'time',
  timestamp: new Date().toISOString().slice(0, -1),
};
export const range = Template.bind({});
const now = new Date();
const threeDaysLater = new Date(now);
threeDaysLater.setDate(threeDaysLater.getDate() + 3);
const sixDaysLater = new Date(now);
sixDaysLater.setDate(sixDaysLater.getDate() + 6);
range.args = {
  displayFormat: 'range',
  endTimestamp: sixDaysLater.toISOString().slice(0, -1),
  timestamp: threeDaysLater.toISOString().slice(0, -1),
};

export const todayRange = Template.bind({});
const threeHoursLater = new Date(now);
threeHoursLater.setHours(threeHoursLater.getHours() + 3);
todayRange.args = {
  displayFormat: 'range',
  endTimestamp: threeHoursLater.toISOString().slice(0, -1),
  showRelative: true,
  timestamp: now.toISOString().slice(0, -1),
};

export const tomorrowRange = Template.bind({});
const tomorrow = new Date(now);
tomorrow.setDate(tomorrow.getDate() + 1);
tomorrowRange.args = {
  displayFormat: 'range',
  endTimestamp: threeDaysLater.toISOString().slice(0, -1),
  showRelative: true,
  timestamp: tomorrow.toISOString().slice(0, -1),
};
