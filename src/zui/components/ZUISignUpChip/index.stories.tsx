import { Meta, StoryObj } from '@storybook/nextjs';

import ZUISignUpChip from './index';

const meta: Meta<typeof ZUISignUpChip> = {
  component: ZUISignUpChip,
  title: 'Components/ZUISignUpChip',
};
export default meta;

type Story = StoryObj<typeof ZUISignUpChip>;

export const Needed: Story = {
  args: {
    status: 'needed',
  },
};

export const SignedUp: Story = {
  args: {
    status: 'signedUp',
  },
};
