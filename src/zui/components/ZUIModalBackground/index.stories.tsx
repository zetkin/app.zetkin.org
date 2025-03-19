import { Meta, StoryObj } from '@storybook/react';

import ZUIModalBackground from './index';

const meta: Meta<typeof ZUIModalBackground> = {
  component: ZUIModalBackground,
  title: 'Components/ZUIModalBackground',
};
export default meta;

type Story = StoryObj<typeof ZUIModalBackground>;

export const Basic: Story = {
  args: {
    height: 300,
    width: 500,
  },
};
