import { ComponentMeta, ComponentStory } from '@storybook/react';

import Calendar from '.';
import mockEvent from 'utils/testing/mocks/mockEvent';
import ReferendumSignatureCollection from '../../../../integrationTesting/mockData/orgs/KPD/campaigns/ReferendumSignatures';
import VisitReferendumWebsite from '../../../../integrationTesting/mockData/orgs/KPD/campaigns/ReferendumSignatures/tasks/VisitReferendumWebsite';

export default {
  component: Calendar,
  title: 'Calendar',
} as ComponentMeta<typeof Calendar>;

const Template: ComponentStory<typeof Calendar> = (args) => (
  <Calendar
    baseHref={args.baseHref}
    campaigns={args.campaigns}
    events={args.events}
    tasks={args.tasks}
  />
);

export const basic = Template.bind({});
basic.args = {
  baseHref: '/organize/1/projects/1/calendar',
  campaigns: [ReferendumSignatureCollection],
  events: [mockEvent()],
  tasks: [VisitReferendumWebsite],
};
