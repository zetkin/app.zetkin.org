import { Meta, StoryFn } from '@storybook/react';

import ZUIDuration from '.';

export default {
  component: ZUIDuration,
  title: 'Atoms/ZUIDuration',
} as Meta<typeof ZUIDuration>;

const Template: StoryFn<typeof ZUIDuration> = (args) => (
  <ZUIDuration
    enableDays={args.enableDays}
    enableHours={args.enableHours}
    enableMilliseconds={args.enableMilliseconds}
    enableMinutes={args.enableMinutes}
    enableSeconds={args.enableSeconds}
    seconds={args.seconds}
  />
);

export const basic = Template.bind({});
basic.args = {
  enableDays: true,
  enableHours: true,
  enableMilliseconds: false,
  enableMinutes: true,
  enableSeconds: false,
  seconds: 12345,
};
