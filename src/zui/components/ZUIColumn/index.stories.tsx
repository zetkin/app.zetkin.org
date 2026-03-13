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

const paragraphStyle = {
  backgroundColor: 'rgb(240, 164, 145)',
  margin: 0,
  padding: '0.5rem',
};

type Story = StoryObj<typeof ZUIColumn>;

export const Basic: Story = {
  args: {
    children: (
      <>
        <p style={paragraphStyle}>Paragraph 1</p>
        <p style={paragraphStyle}>Paragraph 2</p>
        <p style={paragraphStyle}>Paragraph 3</p>
      </>
    ),
  },
};

export const Sized: Story = {
  args: {
    children: (
      <>
        <p style={paragraphStyle}>Size 8 column</p>
        <p style={paragraphStyle}>Paragraph 2</p>
        <p style={paragraphStyle}>Paragraph 3</p>
      </>
    ),
    size: 8,
  },
};
