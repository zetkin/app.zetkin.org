import { Meta, StoryFn } from '@storybook/react';

import CallStateIndicator from '.';

export default {
  component: CallStateIndicator,
  title: 'CallStateIndicator',
} as Meta<typeof CallStateIndicator>;

const Template: StoryFn<typeof CallStateIndicator> = (args) => (
  <CallStateIndicator startTime={args.startTime} state={args.state} />
);

export const basic = Template.bind({});
basic.args = {
  startTime: new Date(),
  state: 'dialling',
};
