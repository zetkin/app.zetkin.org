import { ComponentMeta, ComponentStory } from '@storybook/react';

import mockEvent from 'utils/testing/mocks/mockEvent';
import ReferendumSignatureCollection from '../../../playwright/mockData/orgs/KPD/campaigns/ReferendumSignatures';
import VisitReferendumWebsite from '../../../playwright/mockData/orgs/KPD/campaigns/ReferendumSignatures/tasks/VisitReferendumWebsite';
import ZetkinCalendar from '.';

export default {
  component: ZetkinCalendar,
  title: 'Molecules/ZetkinCalendar',
} as ComponentMeta<typeof ZetkinCalendar>;

const Template: ComponentStory<typeof ZetkinCalendar> = (args) => (
  <ZetkinCalendar
    baseHref={args.baseHref}
    campaigns={args.campaigns}
    events={args.events}
    tasks={args.tasks}
  />
);

export const basic = Template.bind({});
basic.args = {
  baseHref: '/organize/1/campaigns/1/calendar',
  campaigns: [ReferendumSignatureCollection],
  events: [mockEvent()],
  tasks: [VisitReferendumWebsite],
};
