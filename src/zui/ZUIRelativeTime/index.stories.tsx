import { ComponentMeta, ComponentStory } from '@storybook/react';

import ZUIRelativeTime from '.';

export default {
  component: ZUIRelativeTime,
  title: 'Atoms/ZUIRelativeTime',
} as ComponentMeta<typeof ZUIRelativeTime>;

const Template: ComponentStory<typeof ZUIRelativeTime> = (args) => (
  <ZUIRelativeTime
    convertToLocal={args.convertToLocal}
    datetime={args.datetime}
    forcePast={args.forcePast}
  />
);

export const basic = Template.bind({});
basic.args = {
  datetime: '2022-06-01T14:53:15',
};

export const toLocal = Template.bind({});
toLocal.args = {
  convertToLocal: true,
  datetime: '2022-06-01T14:53:15',
};

const mockDatetime = new Date();
mockDatetime.setDate(new Date().getDate() + 1);

// slicing away the "Z" at the end of the ISO-string, because
// that's how dates are formatted coming from the backend.
export const forcedPast = Template.bind({});
forcedPast.args = {
  datetime: mockDatetime.toISOString().slice(0, -1),
  forcePast: true,
};

export const forcedPastAndToLocal = Template.bind({});
forcedPastAndToLocal.args = {
  convertToLocal: true,
  datetime: mockDatetime.toISOString().slice(0, -1),
  forcePast: true,
};
