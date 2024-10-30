import { Meta, StoryObj } from '@storybook/react';

import ZUIDuration from '.';

export default {
  component: ZUIDuration,
  title: 'Other/ZUIDuration',
} as Meta<typeof ZUIDuration>;

export const Basic: StoryObj<typeof ZUIDuration> = {
  args: {
    lowerTimeUnit: 'minutes',
    seconds: 123456.789,
    upperTimeUnit: 'days',
  },
};
