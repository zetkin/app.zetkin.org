import Chance from 'chance';
import dayjs from 'dayjs';

import mockJourneyInstance from 'utils/testing/mocks/mockJourneyInstance';
import mockPerson from 'utils/testing/mocks/mockPerson';
import { ZetkinJourneyInstance } from 'types/zetkin';

const chance = Chance();

// Ensure uniqueness
const ids: number[] = Array.from(Array(20000).keys());

const people = ids
  .splice(0, 20)
  .map((id) =>
    mockPerson({ first_name: chance.first(), id, last_name: chance.last() })
  );
const milestones = [
  'make coffee',
  'prepare for battle',
  'perform lip sync',
  'sashay away',
];

const groupIds = ids.splice(0, 3);
const groupTags: ZetkinJourneyInstance['tags'][] = [
  [
    { color: 'salmon', title: '1 - immediate' },
    { color: 'peach', title: '2 - near future' },
    { color: 'grey', title: '3 - chase up' },
  ].map((tag) => ({
    group: { id: groupIds[0], title: 'Priority' },
    id: ids.shift() as number,
    ...tag,
  })),
  [
    { color: 'beige', title: 'contract' },
    { color: 'cornflowerblue', title: 'pay' },
    { color: 'grey', title: 'disciplinary/dismissal' },
    { color: 'aliceblue', title: 'discrimination' },
    { color: 'aquamarine', title: 'whistleblowing' },
  ].map((tag) => ({
    group: { id: groupIds[1], title: 'Category' },
    id: ids.shift() as number,
    ...tag,
  })),
];

const animalTags = ids.splice(0, 100).map((id) => ({
  color: chance.color(),
  group: { id: groupIds[2], title: 'Animals' },
  id,
  title: chance.animal(),
}));

const valueTagId = ids.shift();
const getValueTag = (): ZetkinJourneyInstance['tags'] => [
  {
    color: 'green',
    group: null,
    id: valueTagId as number,
    title: 'Number of pets',
    value: chance.integer({ max: 11, min: 0 }),
  },
];

const getMultipleTagsGroup = (): ZetkinJourneyInstance['tags'] =>
  chance.pickset(animalTags, chance.integer({ max: 5, min: 2 }));

const getFreeTags = (numTags: number): ZetkinJourneyInstance['tags'] =>
  ids.splice(0, numTags).map((id) => ({
    color: chance.color(),
    group: null,
    id,
    title: chance.word(),
  }));

const dummyTableData = ids.splice(0, 500).map((id) => {
  const created_at = dayjs()
    .subtract(Math.ceil(Math.random() * 200), 'hour')
    .format();

  return mockJourneyInstance({
    assigned_to: chance.pickset(people, chance.pickone([1, 1, 1, 1, 2])),
    created_at,
    id: id + 1,
    next_milestone: {
      deadline: dayjs()
        .add(Math.ceil(Math.random() * 500), 'hour')
        .format(),
      title: chance.pickone(milestones),
    },
    people: chance.pickset(people, chance.pickone([1, 1, 1, 1, 2])),
    summary: chance.sentence({ words: 10 }),
    tags: groupTags
      .map((tags) => chance.pickone(tags))
      .concat(getValueTag())
      .concat(getMultipleTagsGroup())
      .concat(getFreeTags(chance.integer({ max: 5, min: 0 }))),
    updated_at: dayjs()
      .subtract(dayjs().diff(dayjs(created_at), 'minute') / 2, 'minute')
      .format(),
  });
});

export { dummyTableData };
