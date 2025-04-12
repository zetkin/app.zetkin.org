import { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Box } from '@mui/material';

import ZUITimeZonePicker from './index';
import ZUIText from '../ZUIText';

const meta: Meta<typeof ZUITimeZonePicker> = {
  component: ZUITimeZonePicker,
  title: 'Components/ZUITimeZonePicker',
};
export default meta;

type Story = StoryObj<typeof ZUITimeZonePicker>;

export const Basic: Story = {
  render: function Render(args) {
    const [selectedTimeZone, setSelectedTimeZone] = useState(
      args.selectedTimeZone || ''
    );
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <ZUITimeZonePicker
          {...args}
          onChange={(newTimeZone) => setSelectedTimeZone(newTimeZone)}
        />
        {selectedTimeZone && (
          <ZUIText>{`The selected timezone is: ${selectedTimeZone}`}</ZUIText>
        )}
      </Box>
    );
  },
};

export const WithPreselectedTimeZone: Story = {
  args: { selectedTimeZone: '-02:00' },
  render: Basic.render,
};
