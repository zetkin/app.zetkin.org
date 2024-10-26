import Chance from 'chance';
import dayjs from 'dayjs';
import React from 'react';
import { Meta, StoryFn } from '@storybook/react';

const chance = Chance();

import mockNote from 'utils/testing/mocks/mockNote';
import mockUpdate from 'utils/testing/mocks/mockUpdate';
import ZUITimeline from 'zui/ZUITimeline';
import {
  UPDATE_TYPES,
  ZetkinUpdateJourneyInstance,
  ZetkinUpdateJourneyInstanceAddNote,
  ZetkinUpdateJourneyInstanceMilestone,
} from 'zui/ZUITimeline/types';

export default {
  argTypes: {
    backgroundColor: { control: 'color' },
  },
  component: ZUITimeline,
  title: 'Old/ZUITimeline',
} as Meta<typeof ZUITimeline>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: StoryFn<typeof ZUITimeline> = (args) => (
  <div style={{ maxWidth: 450 }}>
    <ZUITimeline {...args} />
  </div>
);

const journeyInstanceUpdates = Array.from(Array(10).keys()).map(() => {
  const update = mockUpdate(UPDATE_TYPES.JOURNEYINSTANCE_UPDATE, {
    timestamp: dayjs()
      .subtract(Math.random() * 100, 'hours')
      .format(),
  }) as ZetkinUpdateJourneyInstance;
  const fieldName = Math.random() > 0.5 ? 'summary' : 'title';
  update.details.changes = {
    [fieldName]: {
      from: '',
      to:
        fieldName === 'title'
          ? chance.sentence({ words: 4 })
          : chance.paragraph({ sentences: chance.integer({ max: 8, min: 2 }) }),
    },
  };
  return update;
});

const addAssigneeUpdates = Array.from(Array(10).keys()).map(() =>
  mockUpdate(
    Math.random() > 0.5
      ? UPDATE_TYPES.JOURNEYINSTANCE_ADDASSIGNEE
      : UPDATE_TYPES.JOURNEYINSTANCE_REMOVEASSIGNEE,
    {
      timestamp: dayjs()
        .subtract(Math.random() * 100, 'hours')
        .format(),
    }
  )
);

const journeyMilestoneUpdates = Array.from(Array(10).keys()).map(() => {
  const update = mockUpdate(UPDATE_TYPES.JOURNEYINSTANCE_UPDATEMILESTONE, {
    timestamp: dayjs()
      .subtract(Math.random() * 100, 'hours')
      .format(),
  }) as ZetkinUpdateJourneyInstanceMilestone;
  update.details.milestone.title = chance.sentence({ words: 4 }).slice(0, -1);
  const dice = Math.random();
  if (dice > 0.33 && dice < 0.66) {
    const change = update.details.changes.completed as {
      from: string;
      to: string;
    };
    update.details.changes.completed = { from: change.to, to: change.from };
  }
  if (dice >= 0.66) {
    update.details.changes = {
      deadline: {
        from: '',
        to:
          dice > 0.85
            ? null
            : dayjs()
                .add(Math.random() * 100, 'hours')
                .format(),
      },
    };
  }
  return update;
});

const noteUpdates = Array.from(Array(10).keys()).map((id) => {
  const update = mockUpdate(UPDATE_TYPES.JOURNEYINSTANCE_ADDNOTE, {
    timestamp: dayjs()
      .subtract(Math.random() * 100, 'hours')
      .format(),
  }) as ZetkinUpdateJourneyInstanceAddNote;
  update.details.note = mockNote({
    id,
    text: `# Heading one

## Heading two

Normal paragraph

_italic text_


~~strike through text~~

[hyperlink](https://jackhanford.com)

> A block quote.

- bullet list item 1
- bullet list item 2

**bold text**

1. ordered list item 1
1. ordered list item 2`,
  });
  return update;
});

const updates = addAssigneeUpdates
  .concat([
    mockUpdate(UPDATE_TYPES.ANY_ADDTAGS, {
      timestamp: dayjs()
        .subtract(Math.random() * 10, 'hours')
        .format(),
    }),
    mockUpdate(UPDATE_TYPES.ANY_REMOVETAGS, {
      timestamp: dayjs()
        .subtract(Math.random() * 10, 'hours')
        .format(),
    }),
  ])
  .concat([
    mockUpdate(UPDATE_TYPES.JOURNEYINSTANCE_ADDSUBJECT, {
      timestamp: dayjs()
        .subtract(Math.random() * 10, 'hours')
        .format(),
    }),
    mockUpdate(UPDATE_TYPES.JOURNEYINSTANCE_REMOVESUBJECT, {
      timestamp: dayjs()
        .subtract(Math.random() * 10, 'hours')
        .format(),
    }),
  ])
  .concat(journeyMilestoneUpdates)
  .concat(journeyInstanceUpdates)
  .concat([
    mockUpdate(UPDATE_TYPES.JOURNEYINSTANCE_OPEN),
    mockUpdate(UPDATE_TYPES.JOURNEYINSTANCE_CLOSE),
  ])
  .concat(noteUpdates)
  .concat([
    mockUpdate(UPDATE_TYPES.JOURNEYINSTANCE_CREATE, {
      timestamp: dayjs()
        .subtract(Math.random() * 100, 'hours')
        .format(),
    }),
  ])
  .sort((a, b) => (dayjs(a.timestamp).isAfter(dayjs(b.timestamp)) ? -1 : 1));

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = { updates };
