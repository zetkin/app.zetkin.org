import { Meta, StoryFn } from '@storybook/react';

import ZUIDate from '.';

export default {
  component: ZUIDate,
  title: 'Other/ZUIDate',
} as Meta<typeof ZUIDate>;

const Template: StoryFn<typeof ZUIDate> = (args) => (
  <ZUIDate datetime={args.datetime} />
);

export const basic = Template.bind({});
basic.args = {
  datetime: new Date().toISOString(),
};
