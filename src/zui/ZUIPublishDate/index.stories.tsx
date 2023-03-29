import { ComponentMeta, ComponentStory } from '@storybook/react';

import ZUIPublishDate from '.';

export default {
  component: ZUIPublishDate,
  title: 'Atoms/ZUIPublishDate',
} as ComponentMeta<typeof ZUIPublishDate>;

const Template: ComponentStory<typeof ZUIPublishDate> = (args) => (
  <ZUIPublishDate end={args.end} start={args.start} />
);

export const invisible = Template.bind({});
invisible.args = {
  end: undefined,
  start: undefined,
};

export const visibleOnwards = Template.bind({});
visibleOnwards.args = {
  start: '2023-01-16T07:00:00+00:00',
};

export const visibleWithEndDate = Template.bind({});
visibleWithEndDate.args = {
  end: '2023-06-16T07:00:00+00:00',
  start: '2023-01-16T07:00:00+00:00',
};

export const scheduledOnwards = Template.bind({});
scheduledOnwards.args = {
  start: '2023-12-16T07:00:00+00:00',
};

export const scheduledWithEndDate = Template.bind({});
scheduledWithEndDate.args = {
  end: '2023-12-23T07:00:00+00:00',
  start: '2023-12-16T07:00:00+00:00',
};
