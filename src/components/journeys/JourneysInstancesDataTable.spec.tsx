import Chance from 'chance';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

import mockJourneyInstance from 'utils/testing/mocks/mockJourneyInstance';
import mockPerson from 'utils/testing/mocks/mockPerson';
import { ZetkinJourneyInstance } from 'types/zetkin';

const chance = Chance();

const ids = Array.from(Array(100).keys());
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

const valueTags = [
  {
    tags: [
      { color: 'salmon', value: '1 - immediate' },
      { color: 'peach', value: '2 - near future' },
      { color: 'grey', value: '3 - chase up' },
    ],
    title: 'priority',
  },
  {
    tags: [
      { color: 'beige', value: 'contract' },
      { color: 'cornflowerblue', value: 'pay' },
      { color: 'grey', value: 'disciplinary/dismissal' },
      { color: 'aliceblue', value: 'discrimination' },
      { color: 'aquamarine', value: 'whistleblowing' },
    ],
    title: 'category',
  },
];

const animals = ids.map((id) => ({
  color: chance.color(),
  id,
  title: chance.animal(),
}));

const getOneOfEachValueTagTypes = (): ZetkinJourneyInstance['tags'] =>
  valueTags.map((column, idx) => ({
    group: null,
    id: idx + 10000,
    title: column.title,
    ...chance.pickone(column.tags),
  }));

const getGroupTags = (): ZetkinJourneyInstance['tags'] => {
  return chance
    .pickset(animals, chance.integer({ max: 5, min: 2 }))
    .map((animal) => ({
      ...animal,
      group: { id: 1, title: 'Animals' },
    }));
};

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
    tags: getOneOfEachValueTagTypes().concat(getGroupTags()),
    updated_at: dayjs()
      .subtract(dayjs().diff(dayjs(created_at), 'minute') / 2, 'minute')
      .format(),
  });
});

export { dummyTableData };
