import { ComponentMeta, ComponentStory } from '@storybook/react';

import mockJourneyInstance from 'utils/testing/mocks/mockJourneyInstance';
import ZetkinJourneyInstanceCard from './ZetkinJourneyInstanceCard';

export default {
  component: ZetkinJourneyInstanceCard,
  title: 'Molecules/JourneyInstanceCard',
} as ComponentMeta<typeof ZetkinJourneyInstanceCard>;

const Template: ComponentStory<typeof ZetkinJourneyInstanceCard> = (args) => (
  <ZetkinJourneyInstanceCard instance={args.instance} />
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
