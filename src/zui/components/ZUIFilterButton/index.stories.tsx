import { Meta, StoryObj } from '@storybook/nextjs';
import { Close, Event } from '@mui/icons-material';
import { useState } from 'react';
import { Box } from '@mui/material';

import ZUIFilterButton from './index';

const meta: Meta<typeof ZUIFilterButton> = {
  component: ZUIFilterButton,
  title: 'Components/ZUIFilterButton',
};
export default meta;

type Story = StoryObj<typeof ZUIFilterButton>;

export const TextLabel: Story = {
  args: {
    label: 'Text label',
  },
  render: function Render(args) {
    const [active, setActive] = useState(false);
    return (
      <Box>
        <ZUIFilterButton
          {...args}
          active={active}
          onClick={() => setActive(!active)}
        />
      </Box>
    );
  },
};

export const Icon: Story = {
  args: {
    label: Event,
  },
  render: TextLabel.render,
};

export const IconCircular: Story = {
  args: {
    active: true,
    circular: true,
    label: Close,
  },
};
