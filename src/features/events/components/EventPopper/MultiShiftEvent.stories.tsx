import { Box } from '@mui/material';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import mockEvent from 'utils/testing/mocks/mockEvent';
import MultiShiftEvent from './MultiShiftEvent';

export default {
  component: MultiShiftEvent,
  title: 'MultiShiftEvent',
} as ComponentMeta<typeof MultiShiftEvent>;

const Template: ComponentStory<typeof MultiShiftEvent> = (args) => {
  return (
    <Box width="400px">
      <MultiShiftEvent events={args.events} />
    </Box>
  );
};

export const shift = Template.bind({});
shift.args = {
  events: [mockEvent(), mockEvent(), mockEvent()],
};
