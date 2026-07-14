import { Meta, StoryFn } from '@storybook/nextjs';

import mockJourneyInstance from 'utils/testing/mocks/mockJourneyInstance';
import ZUIJourneyInstanceCard from '.';

export default {
  component: ZUIJourneyInstanceCard,
  title: 'Other/ZUIJourneyInstanceCard',
} as Meta<typeof ZUIJourneyInstanceCard>;

const Template: StoryFn<typeof ZUIJourneyInstanceCard> = (args) => (
  <ZUIJourneyInstanceCard instance={args.instance} orgId={1} />
);

export const open = Template.bind({});
open.args = {
  instance: mockJourneyInstance(),
};

export const closed = Template.bind({});
closed.args = {
  instance: mockJourneyInstance({
    closed: new Date().toISOString(),
  }),
};
