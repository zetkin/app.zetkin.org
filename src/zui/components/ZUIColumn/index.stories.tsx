import { Meta, StoryObj } from '@storybook/react';

import ZUIColumn from './index';
import ZUIRow from '../ZUIRow';

const meta: Meta<typeof ZUIColumn> = {
  component: ZUIColumn,
  decorators: [
    (Story) => (
      <ZUIRow>
        <Story />
      </ZUIRow>
    ),
  ],
};
export default meta;

const columnStyle = {
  backgroundColor: 'swatches.purple.100',
  height: '200px',
};

type Story = StoryObj<typeof ZUIColumn>;

export const Basic: Story = {
  args: {
    children: 'Column content',
    sx: columnStyle,
  },
};

export const Sized: Story = {
  args: {
    children: 'Size 8 Column content',
    size: 8,
    sx: columnStyle,
  },
};
