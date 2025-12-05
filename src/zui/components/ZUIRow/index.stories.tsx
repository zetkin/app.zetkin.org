import { Meta, StoryObj } from '@storybook/react';

import ZUIColumn from '../ZUIColumn';
import ZUIRow from './index';

const meta: Meta<typeof ZUIRow> = {
  component: ZUIRow,
};
export default meta;

const columnStyle = {
  backgroundColor: 'swatches.purple.100',
  height: '200px',
};

type Story = StoryObj<typeof ZUIRow>;

export const Basic: Story = {
  args: {
    children: [
      <ZUIColumn key="1" sx={columnStyle}>
        Column 1
      </ZUIColumn>,
      <ZUIColumn key="2" sx={columnStyle}>
        Column 2
      </ZUIColumn>,
      <ZUIColumn key="3" sx={columnStyle}>
        Column 3
      </ZUIColumn>,
    ],
  },
};

export const SizedAndAuto: Story = {
  args: {
    children: [
      <ZUIColumn key="1" size={8} sx={columnStyle}>
        Size 8 column
      </ZUIColumn>,
      <ZUIColumn key="2" sx={columnStyle}>
        No size column
      </ZUIColumn>,
    ],
  },
};

export const MultipleSizedAndAuto: Story = {
  args: {
    children: [
      <ZUIColumn key="1" size={3} sx={columnStyle}>
        Size 3 column
      </ZUIColumn>,
      <ZUIColumn key="2" size={1} sx={columnStyle}>
        Size 1 column
      </ZUIColumn>,
      <ZUIColumn key="3" size={3} sx={columnStyle}>
        Size 3 column
      </ZUIColumn>,
      <ZUIColumn key="4" sx={columnStyle}>
        No size column
      </ZUIColumn>,
    ],
  },
};
