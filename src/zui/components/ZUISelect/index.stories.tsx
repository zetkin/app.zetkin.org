import { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import ZUISelect from './index';

const meta: Meta<typeof ZUISelect> = {
  component: ZUISelect,
  title: 'Components/ZUISelect',
};
export default meta;

type Story = StoryObj<typeof ZUISelect>;

export const Basic: Story = {
  args: {
    items: [
      {
        label: 'Maria',
        value: 'm',
      },
      { label: 'Joanna', value: 'j' },
      { label: 'Elisabeth-Anne', value: 'e' },
    ],
    label: 'Name',
  },
  render: function Render(args) {
    const [selection, setSelection] = useState<'m' | 'j' | 'e' | ''>('');

    return (
      <ZUISelect
        disabled={args.disabled}
        error={args.error}
        items={args.items}
        label={args.label}
        onChange={(newSelection) => {
          setSelection(newSelection as 'm' | 'j' | 'e' | '');
        }}
        selectedOption={selection}
        size={args.size}
      />
    );
  },
};

export const Large: Story = {
  args: { ...Basic.args, size: 'large' },
  render: Basic.render,
};

export const Disabled: Story = {
  args: { ...Basic.args, disabled: true },
  render: Basic.render,
};

export const Error: Story = {
  args: { ...Basic.args, error: true },
  render: Basic.render,
};

export const Subheaders: Story = {
  args: {
    items: [
      {
        selectItems: [
          {
            label: 'Maria',
            value: 'm',
          },
          { label: 'Joanna', value: 'j' },
          { label: 'Elisabeth-Anne', value: 'e' },
        ],
        title: 'First names',
      },
      {
        selectItems: [
          {
            label: 'Junssun',
            value: 'j',
          },
          { label: 'Kalliope', value: 'k' },
          { label: 'Rask', value: 'r' },
        ],
        title: 'Last names',
      },
    ],
    label: 'Name',
  },
  render: Basic.render,
};
