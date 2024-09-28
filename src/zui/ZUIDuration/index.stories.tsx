import { Meta, StoryObj } from '@storybook/react';

import ZUIDuration from '.';

export default {
  component: ZUIDuration,
  title: 'Atoms/ZUIDuration',
} as Meta<typeof ZUIDuration>;

export const Basic: StoryObj<typeof ZUIDuration> = {
  args: {
    seconds: 123456789.5,
    withDays: true,
    withHours: true,
    withMinutes: true,
    withSeconds: false,
    withThousands: false,
  },
};
