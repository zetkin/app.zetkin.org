import { Box } from '@mui/material';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { EventState } from 'features/events/models/EventDataModel';
import mockEvent from 'utils/testing/mocks/mockEvent';
import mockEventParticipant from 'utils/testing/mocks/mockEventParticipant';
import EventPopperListItem, { CLUSTER_TYPE } from './EventPopperListItem';

export default {
  component: EventPopperListItem,
  title: 'EventPopperListItem',
} as ComponentMeta<typeof EventPopperListItem>;

const Template: ComponentStory<typeof EventPopperListItem> = (args) => {
  return (
    <Box>
      <EventPopperListItem
        checked={args.checked}
        clusterType={args.clusterType}
        compact={args.compact}
        event={args.event}
        onChange={args.onChange}
        participants={args.participants}
        state={args.state}
      />
    </Box>
  );
};

export const shift = Template.bind({});
shift.args = {
  checked: false,
  clusterType: CLUSTER_TYPE.SHIFT,
  compact: false,
  event: { ...mockEvent() },
  onChange: () => null,
  participants: [mockEventParticipant()],
  state: EventState.OPEN,
};

export const location = Template.bind({});
location.args = {
  checked: false,
  clusterType: CLUSTER_TYPE.LOCATION,
  compact: false,
  event: { ...mockEvent() },
  onChange: () => null,
  participants: [mockEventParticipant()],
  state: EventState.OPEN,
};

export const arbitrary = Template.bind({});
arbitrary.args = {
  checked: false,
  clusterType: CLUSTER_TYPE.ARBITRARY,
  compact: false,
  event: { ...mockEvent() },
  onChange: () => null,
  participants: [mockEventParticipant()],
  state: EventState.OPEN,
};
