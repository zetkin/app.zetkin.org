import { ComponentMeta, ComponentStory } from '@storybook/react';

import EventPopper from '.';
import { EventState } from '../../models/EventDataModel';
import mockEvent from '../../../../utils/testing/mocks/mockEvent';
import mockEventParticipant from 'utils/testing/mocks/mockEventParticipant';
import mockEventResponse from 'utils/testing/mocks/mockZetkinEventResponse';
import {
  ZetkinEventParticipant,
  ZetkinEventResponse,
} from '../../../../utils/types/zetkin';

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
  participants: [
    mockEventParticipant(),
    {
      alt_phone: '',
      city: 'Berlin',
      co_address: '',
      country: 'Germany',
      email: 'clara@kpd.org',
      ext_id: '12',
      first_name: 'Clara',
      gender: 'f',
      id: 2,
      is_user: false,
      last_name: 'Zetkin',
      phone: '00497988281721',
      street_address: 'Kleine Alexanderstraße 28',
      zip_code: '10178',
    } as ZetkinEventParticipant,
  ],
  respondents: [
    mockEventResponse(),
    {
      action_id: 2,
      id: 3,
      person: {
        id: 3,
        name: 'Clara Zetkin',
      },
      response_date: '2022-04-16T07:00:00+00:00',
    } as ZetkinEventResponse,
  ],
  state: EventState.OPEN,
};
export const cancelled = Template.bind({});
cancelled.args = {
  event: mockEvent(),
  participants: [mockEventParticipant()],
  respondents: [mockEventResponse()],
  state: EventState.CANCELLED,
};
