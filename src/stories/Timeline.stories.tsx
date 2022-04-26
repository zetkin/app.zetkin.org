import Chance from 'chance';
import dayjs from 'dayjs';
import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

const chance = Chance();

import mockUpdate from 'utils/testing/mocks/mockUpdate';
import Timeline from 'components/Timeline';
import { UPDATE_TYPES, ZetkinUpdateJourneyMilestone } from 'types/updates';

export default {
  argTypes: {
    backgroundColor: { control: 'color' },
  },
  component: Timeline,
  title: 'Example/Timeline',
} as ComponentMeta<typeof Timeline>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Timeline> = (args) => (
  <Timeline {...args} showAll />
);

const addAssigneeUpdates = Array.from(Array(10).keys()).map(() =>
  mockUpdate(UPDATE_TYPES.JOURNEYINSTANCE_ADDASSIGNEE, {
    timestamp: dayjs()
      .subtract(Math.random() * 100, 'hours')
      .format(),
  })
);

const journeyMilestoneUpdates = Array.from(Array(10).keys()).map(() => {
  const update = mockUpdate(UPDATE_TYPES.JOURNEYINSTANCE_UPDATEMILESTONE, {
    timestamp: dayjs()
      .subtract(Math.random() * 100, 'hours')
      .format(),
  }) as ZetkinUpdateJourneyMilestone;
  update.details.milestone.title = chance.sentence({ words: 4 });
  if (Math.random() > 0.5) {
    const change = update.details.changes.completed;
    update.details.changes.completed = { from: change.to, to: change.from };
  }
  return update;
});

const updates = addAssigneeUpdates
  .concat(journeyMilestoneUpdates)
  .sort((a, b) => (dayjs(a.timestamp).isAfter(dayjs(b.timestamp)) ? -1 : 1));

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = { updates };
