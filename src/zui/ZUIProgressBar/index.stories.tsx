import { Meta, StoryObj } from '@storybook/react';

import ZUIProgressBar from './index';

const meta: Meta<typeof ZUIProgressBar> = {
  component: ZUIProgressBar,
};
export default meta;

type Story = StoryObj<typeof ZUIProgressBar>;

export const Primary: Story = {
  args: {
    label: 'Primary',
    variant: 'primary',
  },
};
