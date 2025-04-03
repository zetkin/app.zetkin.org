import { Meta, StoryObj } from '@storybook/react';

import ZUISuffixedNumber from './index';

const meta: Meta<typeof ZUISuffixedNumber> = {
  component: ZUISuffixedNumber,
  title: 'Components/ZUISuffixedNumber',
};
export default meta;

type Story = StoryObj<typeof ZUISuffixedNumber>;

export const Basic: Story = {
  args: {
    number: 45347576,
  },
};
