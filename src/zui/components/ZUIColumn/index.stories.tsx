import { Meta, StoryFn, StoryObj } from '@storybook/react';

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
  height: '200px',
  backgroundColor: 'swatches.purple.100',
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
    children: 'Siz 8 Column content',
    sx: columnStyle,
    size: 8,
  },
};
