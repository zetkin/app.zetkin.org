import { Meta, StoryObj } from '@storybook/react';

import ZUIColumn from '../ZUIColumn';
import ZUIRow from './index';

const meta: Meta<typeof ZUIRow> = {
  component: ZUIRow,
};
export default meta;

const paragraphStyle = {
  backgroundColor: 'rgb(240, 164, 145)',
  margin: 0,
  padding: '0.5rem',
};

type Story = StoryObj<typeof ZUIRow>;

export const Basic: Story = {
  args: {
    children: [
      <ZUIColumn key="1">
        <p style={paragraphStyle}>Paragraph 1</p>
        <p style={paragraphStyle}>Paragraph 2</p>
        <p style={paragraphStyle}>Paragraph 3</p>
      </ZUIColumn>,
      <ZUIColumn key="2">
        <p style={paragraphStyle}>Paragraph 1</p>
        <p style={paragraphStyle}>Paragraph 2</p>
        <p style={paragraphStyle}>Paragraph 3</p>
      </ZUIColumn>,
      <ZUIColumn key="3">
        <p style={paragraphStyle}>Paragraph 1</p>
        <p style={paragraphStyle}>Paragraph 2</p>
        <p style={paragraphStyle}>Paragraph 3</p>
      </ZUIColumn>,
    ],
  },
};

export const SizedAndAuto: Story = {
  args: {
    children: [
      <ZUIColumn key="1" size={8}>
        <p style={paragraphStyle}>Size 8 column</p>
        <p style={paragraphStyle}>Paragraph 2</p>
        <p style={paragraphStyle}>Paragraph 3</p>
      </ZUIColumn>,
      <ZUIColumn key="2">
        <p style={paragraphStyle}>No size column</p>
        <p style={paragraphStyle}>Paragraph 2</p>
        <p style={paragraphStyle}>Paragraph 3</p>
      </ZUIColumn>,
    ],
  },
};

export const MultipleSizedAndNull: Story = {
  args: {
    children: [
      <ZUIColumn key="1" size={3}>
        <p style={paragraphStyle}>Size 3 column</p>
        <p style={paragraphStyle}>Paragraph 2</p>
        <p style={paragraphStyle}>Paragraph 3</p>
      </ZUIColumn>,
      <ZUIColumn key="2" size={1}>
        <p style={paragraphStyle}>Size 1 column</p>
        <p style={paragraphStyle}>Paragraph 2</p>
        <p style={paragraphStyle}>Paragraph 3</p>
      </ZUIColumn>,
      <ZUIColumn key="3" size={3}>
        <p style={paragraphStyle}>Size 3 column</p>
        <p style={paragraphStyle}>Paragraph 2</p>
        <p style={paragraphStyle}>Paragraph 3</p>
      </ZUIColumn>,
      <ZUIColumn key="4" size={null}>
        <p style={paragraphStyle}>Null size column</p>
        <p style={paragraphStyle}>Paragraph 2</p>
        <p style={paragraphStyle}>Paragraph 3</p>
      </ZUIColumn>,
    ],
  },
};
