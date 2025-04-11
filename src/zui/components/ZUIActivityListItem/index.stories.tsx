import { Meta, StoryObj } from '@storybook/react';
import { Box } from '@mui/material';
import { useState } from 'react';

import ZUIActivityListItem from '.';
import { activities } from './storybookActivities';

const meta: Meta<typeof ZUIActivityListItem> = {
  component: ZUIActivityListItem,
  title: 'Components/ZUIActivityListItem',
};
export default meta;

type Story = StoryObj<typeof ZUIActivityListItem>;

export const Default: Story = {
  render: function Render() {
    return (
      <Box>
        {activities.map((activity, index) => (
          <ZUIActivityListItem key={`Default-${index}`} {...activity} />
        ))}
      </Box>
    );
  },
};

export const DefaultCheckboxes: Story = {
  render: function Render() {
    const [checked, setChecked] = useState<number[]>([]);
    return (
      <Box>
        {activities.map((activity, index) => (
          <ZUIActivityListItem
            key={`DefaultCheckboxes-${index}`}
            {...activity}
            checkboxProps={{
              checked: checked.includes(index),
              onChange: (newCheckedState) => {
                if (newCheckedState) {
                  setChecked(checked.concat([index]));
                } else {
                  setChecked(checked.filter((i) => i != index));
                }
              },
            }}
          />
        ))}
      </Box>
    );
  },
};

export const Wide: Story = {
  render: function Render() {
    return (
      <Box>
        {activities.map((activity, index) => (
          <ZUIActivityListItem
            key={`Wide-${index}`}
            {...activity}
            variant="wide"
          />
        ))}
      </Box>
    );
  },
};

export const WideCheckboxes: Story = {
  render: function Render() {
    const [checked, setChecked] = useState<number[]>([]);
    return (
      <Box>
        {activities.map((activity, index) => (
          <ZUIActivityListItem
            key={`WideCheckboxes-${index}`}
            {...activity}
            checkboxProps={{
              checked: checked.includes(index),
              onChange: (newCheckedState) => {
                if (newCheckedState) {
                  setChecked(checked.concat([index]));
                } else {
                  setChecked(checked.filter((i) => i != index));
                }
              },
            }}
            variant="wide"
          />
        ))}
      </Box>
    );
  },
};

export const Narrow: Story = {
  render: function Render() {
    return (
      <Box sx={{ width: '400px' }}>
        {activities.map((activity, index) => (
          <ZUIActivityListItem
            key={`Narrow-${index}`}
            {...activity}
            variant="narrow"
          />
        ))}
      </Box>
    );
  },
};

export const NarrowCheckboxes: Story = {
  render: function Render() {
    const [checked, setChecked] = useState<number[]>([]);
    return (
      <Box sx={{ width: '400px' }}>
        {activities.map((activity, index) => (
          <ZUIActivityListItem
            key={`NarrowCheckboxes-${index}`}
            {...activity}
            checkboxProps={{
              checked: checked.includes(index),
              onChange: (newCheckedState) => {
                if (newCheckedState) {
                  setChecked(checked.concat([index]));
                } else {
                  setChecked(checked.filter((i) => i != index));
                }
              },
            }}
            variant="narrow"
          />
        ))}
      </Box>
    );
  },
};
