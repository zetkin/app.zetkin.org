import { Meta, StoryObj } from '@storybook/react';

import ZUIDuration from '.';

export default {
  component: ZUIDuration,
  title: 'Atoms/ZUIDuration',
} as Meta<typeof ZUIDuration>;

export const Basic: StoryObj<typeof ZUIDuration> = {
  args: {
    enableDays: true,
    enableHours: true,
    enableMilliseconds: false,
    enableMinutes: true,
    enableSeconds: false,
    seconds: 12345,
  },
};
