import { Meta, StoryObj } from '@storybook/react';

import ZUIAlert from './index';

const meta: Meta<typeof ZUIAlert> = {
  component: ZUIAlert,
  title: 'Components/ZUIAlert',
};
export default meta;

type Story = StoryObj<typeof ZUIAlert>;

export const Basic: Story = {
  args: {
    severity: 'info',
    title: 'This is the title to alert the user to something',
  },
};

export const Description: Story = {
  args: {
    ...Basic.args,
    description:
      'This is the description where we give a bit of context to whatever it is we are trying to alert the user to. It is a string so it will be rendered as one continuous text.',
  },
};

export const CloseButton: Story = {
  args: { ...Basic.args, onClose: () => null },
};

export const DescriptionAndCloseButton: Story = {
  args: { ...Description.args, onClose: () => null },
};

export const Button: Story = {
  args: {
    ...Description.args,
    buttonProps: { label: 'Click me', onClick: () => null },
  },
};

export const CloseButtonAndButton: Story = {
  args: {
    ...CloseButton.args,
    ...Button.args,
  },
};

export const VeryLongTitle: Story = {
  args: {
    ...Basic.args,
    title:
      'This is a very long title because we are not using a description so we are trying to fit a lot of information in here.',
  },
};
