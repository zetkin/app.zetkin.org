import { Box } from '@mui/material';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import EventPopperListItem from './EventPopperListItem';
import mockEvent from 'utils/testing/mocks/mockEvent';
import mockEventParticipant from 'utils/testing/mocks/mockEventParticipant';

export default {
  component: EventPopperListItem,
  title: 'EventPopperListItem',
} as ComponentMeta<typeof EventPopperListItem>;

const Template: ComponentStory<typeof EventPopperListItem> = (args) => {
  return (
    <Box width="400px">
      <EventPopperListItem
        compact={args.compact}
        event={args.event}
        participants={args.participants}
      />
    </Box>
  );
};

export const basic = Template.bind({});
basic.args = {
  compact: false,
  event: { ...mockEvent(), num_participants_required: 3 },
  participants: [mockEventParticipant()],
};
