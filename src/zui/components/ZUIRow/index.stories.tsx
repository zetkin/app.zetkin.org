import { Meta, StoryObj } from '@storybook/react';

import ZUIColumn from '../ZUIColumn';
import ZUIRow from './index';

const meta: Meta<typeof ZUIRow> = {
  component: ZUIRow,
};
export default meta;

const columnStyle = {
  height: '200px',
  backgroundColor: 'swatches.purple.100',
};

type Story = StoryObj<typeof ZUIRow>;

export const Basic: Story = {
  args: {
    children: [
      <ZUIColumn sx={columnStyle}>Column 1</ZUIColumn>,
      <ZUIColumn sx={columnStyle}>Column 2</ZUIColumn>,
      <ZUIColumn sx={columnStyle}>Column 3</ZUIColumn>,
    ],
  },
};

export const SizedAndAuto: Story = {
  args: {
    children: [
      <ZUIColumn sx={columnStyle} size={8}>
        Size 8 column
      </ZUIColumn>,
      <ZUIColumn sx={columnStyle}>No size column</ZUIColumn>,
    ],
  },
};

export const MultipleSizedAndAuto: Story = {
  args: {
    children: [
      <ZUIColumn sx={columnStyle} size={3}>
        Size 3 column
      </ZUIColumn>,
      <ZUIColumn sx={columnStyle} size={1}>
        Size 1 column
      </ZUIColumn>,
      <ZUIColumn sx={columnStyle} size={3}>
        Size 3 column
      </ZUIColumn>,
      <ZUIColumn sx={columnStyle}>No size column</ZUIColumn>,
    ],
  },
};
