import { Meta, StoryObj } from '@storybook/react';

import ZUITagChip from './index';

const meta: Meta<typeof ZUITagChip> = {
  component: ZUITagChip,
};
export default meta;

type Story = StoryObj<typeof ZUITagChip>;

export const Basic: Story = {
  args: {
    tag: {
      color: null,
      description: 'People who organize',
      group: null,
      hidden: false,
      id: 1,
      organization: {
        id: 1,
        title: 'My Organization',
      },
      title: 'Organizer',
      value_type: null,
    },
  },
};

export const ValueTag: Story = {
  args: {
    tag: {
      color: '#187F81',
      description: 'The amount this person gets paid',
      group: null,
      hidden: false,
      id: 1,
      organization: {
        id: 1,
        title: 'My Organization',
      },
      title: 'Salary',
      value: '23000',
      value_type: 'text',
    },
  },
};

export const BasicWithAction: Story = {
  args: {
    ...Basic.args,
    onClick: () => null,
  },
  render: Basic.render,
};

export const ValueTagWithAction: Story = {
  args: {
    ...ValueTag.args,
    onClick: () => null,
  },
};

export const DeletableBasic: Story = {
  args: {
    ...Basic.args,
    onDelete: () => null,
  },
};

export const DeletableValueTag: Story = {
  args: {
    ...ValueTag.args,
    onDelete: () => null,
  },
};

export const Disabled: Story = {
  args: {
    ...Basic.args,
    disabled: true,
    onClick: () => null,
    onDelete: () => null,
  },
};
