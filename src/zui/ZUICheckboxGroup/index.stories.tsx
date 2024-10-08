import { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';

import ZUICheckboxGroup from './index';

const meta: Meta<typeof ZUICheckboxGroup> = {
  component: ZUICheckboxGroup,
};
export default meta;

type Story = StoryObj<typeof ZUICheckboxGroup>;

export const Basic: Story = {
  args: {
    helperText: 'You can pick multiple groups',
    label: 'Groups you belong to',
  },
  render: function Render(args) {
    const [selectedGroups, setSelectedGroups] = useState({
      kitchen: false,
      party: false,
      protest: false,
    });

    const options = [
      {
        checked: selectedGroups.kitchen,
        label: 'Kitchen team',
        onChange: () =>
          setSelectedGroups({
            ...selectedGroups,
            kitchen: !selectedGroups.kitchen,
          }),
      },
      {
        checked: selectedGroups.party,
        label: 'Party planners',
        onChange: () =>
          setSelectedGroups({
            ...selectedGroups,
            party: !selectedGroups.party,
          }),
      },
      {
        checked: selectedGroups.protest,
        label: 'Protest committee',
        onChange: () =>
          setSelectedGroups({
            ...selectedGroups,
            protest: !selectedGroups.protest,
          }),
      },
    ];

    return (
      <ZUICheckboxGroup
        {...args}
        error={
          args.error &&
          !selectedGroups.kitchen &&
          !selectedGroups.party &&
          !selectedGroups.protest
        }
        options={options}
      />
    );
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    helperText: 'You can pick multiple groups',
    label: 'Which groups do you want to participate in?',
  },
  render: Basic.render,
};

export const Error: Story = {
  args: {
    error: true,
    helperText: 'You need to pick at least one group',
    label: 'Which groups do you want to participate in?',
  },
  render: Basic.render,
};
