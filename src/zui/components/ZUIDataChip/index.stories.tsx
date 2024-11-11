import { Meta, StoryObj } from '@storybook/react';

import ZUIDataChip from './index';

const meta: Meta<typeof ZUIDataChip> = {
  component: ZUIDataChip,
  title: 'Components/ZUIDataChip',
};
export default meta;

type Story = StoryObj<typeof ZUIDataChip>;

export const Basic: Story = {
  args: {
    status: 'none',
    value: 394,
  },
};
