import { Box } from '@mui/material';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { EventState } from 'features/events/models/EventDataModel';
import mockEvent from 'utils/testing/mocks/mockEvent';
import mockEventParticipant from 'utils/testing/mocks/mockEventParticipant';
import MultiEventListItem, { CLUSTER_TYPE } from './MultiEventListItem';

export default {
  component: MultiEventListItem,
  title: 'EventPopperListItem',
} as ComponentMeta<typeof MultiEventListItem>;

const Template: ComponentStory<typeof MultiEventListItem> = (args) => {
  return (
    <Box>
      <MultiEventListItem
        clusterType={args.clusterType}
        compact={args.compact}
        event={args.event}
        participants={args.participants}
        state={args.state}
      />
    </Box>
  );
};

export const shift = Template.bind({});
shift.args = {
  clusterType: CLUSTER_TYPE.SHIFT,
  compact: false,
  event: { ...mockEvent() },
  participants: [mockEventParticipant()],
  state: EventState.OPEN,
};

export const location = Template.bind({});
location.args = {
  clusterType: CLUSTER_TYPE.LOCATION,
  compact: false,
  event: { ...mockEvent() },
  participants: [mockEventParticipant()],
  state: EventState.OPEN,
};

export const arbitrary = Template.bind({});
arbitrary.args = {
  clusterType: CLUSTER_TYPE.ARBITRARY,
  compact: false,
  event: { ...mockEvent() },
  participants: [mockEventParticipant()],
  state: EventState.OPEN,
};
