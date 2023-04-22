import { ComponentMeta, ComponentStory } from '@storybook/react';

import EventPopper from '.';
import { EventState } from '../../models/EventDataModel';
import mockEvent from '../../../../utils/testing/mocks/mockEvent';
import mockEventParticipant from 'utils/testing/mocks/mockEventParticipant';
import mockEventResponse from 'utils/testing/mocks/mockZetkinEventResponse';

export default {
  component: EventPopper,
  title: 'EventPopper',
} as ComponentMeta<typeof EventPopper>;

const Template: ComponentStory<typeof EventPopper> = (args) => {
  return (
    <EventPopper
      event={args.event}
      onCancel={args.onCancel}
      onDelete={args.onDelete}
      onPublish={args.onPublish}
      participants={args.participants}
      respondents={args.respondents}
      state={args.state}
    />
  );
};

export const basic = Template.bind({});
basic.args = {
  event: mockEvent(),
  onCancel: (e) => e,
  onDelete: (e) => e,
  onPublish: () => null,
  participants: [mockEventParticipant()],
  respondents: [mockEventResponse()],
  state: EventState.OPEN,
};
export const cancelled = Template.bind({});
cancelled.args = {
  event: mockEvent(),
  participants: [mockEventParticipant()],
  respondents: [mockEventResponse()],
  state: EventState.CANCELLED,
};
