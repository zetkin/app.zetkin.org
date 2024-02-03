import { ComponentMeta, ComponentStory } from '@storybook/react';

import mockJourneyInstance from 'utils/testing/mocks/mockJourneyInstance';
import mockOrganization from 'utils/testing/mocks/mockOrganization';
import ZUIJourneyInstanceItem from '.';

export default {
  component: ZUIJourneyInstanceItem,
  title: 'Atoms/ZUIJourneyInstanceItem',
} as ComponentMeta<typeof ZUIJourneyInstanceItem>;

const Template: ComponentStory<typeof ZUIJourneyInstanceItem> = (args) => (
  <ZUIJourneyInstanceItem instance={args.instance} orgId={args.orgId} />
);

export const basic = Template.bind({});
basic.args = {
  instance: mockJourneyInstance(),
  orgId: mockOrganization().id,
};

export const openWithoutMeta = Template.bind({});
openWithoutMeta.args = {
  instance: { ...mockJourneyInstance(), next_milestone: null },
};

export const closed = Template.bind({});
closed.args = {
  instance: { ...mockJourneyInstance(), closed: '2022-06-10T03:29:12.000' },
  orgId: mockOrganization().id,
};
