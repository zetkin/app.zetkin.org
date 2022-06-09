import { ComponentMeta, ComponentStory } from '@storybook/react';

import ZetkinRelativeTime from './ZetkinRelativeTime';

export default {
  component: ZetkinRelativeTime,
  title: 'Atoms/ZetkinRelativeTime',
} as ComponentMeta<typeof ZetkinRelativeTime>;

const Template: ComponentStory<typeof ZetkinRelativeTime> = (args) => (
  <ZetkinRelativeTime
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

export const forcedPast = Template.bind({});
forcedPast.args = {
  datetime: mockDatetime.toISOString().slice(0, 19),
  forcePast: true,
};

export const forcedPastAndToLocal = Template.bind({});
forcedPastAndToLocal.args = {
  convertToLocal: true,
  datetime: mockDatetime.toISOString().slice(0, 19),
  forcePast: true,
};
