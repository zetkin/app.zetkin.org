import { Meta, StoryObj } from '@storybook/react';

import ZUILabel from '.';

const meta: Meta<typeof ZUILabel> = {
  component: ZUILabel,
};
export default meta;

type Story = StoryObj<typeof ZUILabel>;

export const LabelMdMedium: Story = {
  args: {
    children: 'This is a medium size, medium weight label text',
    variant: 'labelMdMedium',
  },
};

export const LabelMdRegular: Story = {
  args: {
    children: 'This is a medium size, regular weight label text',
    variant: 'labelMdRegular',
  },
};
