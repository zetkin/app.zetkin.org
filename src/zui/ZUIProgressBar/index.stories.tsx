import { Meta, StoryObj } from '@storybook/react';

import ZUIProgressBar from './index';

const meta: Meta<typeof ZUIProgressBar> = {
  component: ZUIProgressBar,
};
export default meta;

type Story = StoryObj<typeof ZUIProgressBar>;

export const Primary: Story = {
  args: {
    progress: 25,
    size: 'medium',
  },
};
