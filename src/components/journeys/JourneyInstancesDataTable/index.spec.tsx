import Chance from 'chance';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

import mockJourneyInstance from 'utils/testing/mocks/mockJourneyInstance';
import mockPerson from 'utils/testing/mocks/mockPerson';
import { ZetkinJourneyInstance } from 'types/zetkin';

const chance = Chance();

const ids = Array.from(Array(200).keys());
const people = ids
  .slice(1, 20)
  .map((id) =>
    mockPerson({ first_name: chance.first(), id, last_name: chance.last() })
  );
const milestones = [
  'make coffee',
  'prepare for battle',
  'perform lip sync',
  'sashay away',
];

const groupTags: ZetkinJourneyInstance['tags'][] = [
  [
    { color: 'salmon', title: '1 - immediate' },
    { color: 'peach', title: '2 - near future' },
    { color: 'grey', title: '3 - chase up' },
  ].map((tag, idx) => ({
    group: { id: 2, title: 'priority' },
    id: 300 + idx,
    ...tag,
  })),
  [
    { color: 'beige', title: 'contract' },
    { color: 'cornflowerblue', title: 'pay' },
    { color: 'grey', title: 'disciplinary/dismissal' },
    { color: 'aliceblue', title: 'discrimination' },
    { color: 'aquamarine', title: 'whistleblowing' },
  ].map((tag, idx) => ({
    group: { id: 3, title: 'category' },
    id: 400 + idx,
    ...tag,
  })),
];

const animalTags = ids.slice(1, 100).map((id) => ({
  color: chance.color(),
  group: { id: 1, title: 'Animals' },
  id,
  title: chance.animal(),
}));

const getValueTag = (): ZetkinJourneyInstance['tags'] => [
  {
    color: 'green',
    group: null,
    id: 2000,
    title: 'Number of pets',
    value: chance.integer({ max: 11, min: 0 }),
  },
];

const getMultipleTagsGroup = (): ZetkinJourneyInstance['tags'] =>
  chance.pickset(animalTags, chance.integer({ max: 5, min: 2 }));

const dummyTableData = ids.map((id) => {
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
      .concat(getMultipleTagsGroup()),
    updated_at: dayjs()
      .subtract(dayjs().diff(dayjs(created_at), 'minute') / 2, 'minute')
      .format(),
  });
});

export { dummyTableData };
