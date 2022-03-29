import Chance from 'chance';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

import mockJourneyInstance from 'utils/testing/mocks/mockJourneyInstance';
import mockPerson from 'utils/testing/mocks/mockPerson';

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

const dummyTableData = ids.map((id) => {
  const created_at = dayjs()
    .subtract(Math.ceil(Math.random() * 200), 'hour')
    .format();

  return mockJourneyInstance({
    assigned_to: chance.pickset(people, chance.pickone([1, 1, 1, 1, 1, 2, 3])),
    created_at,
    id: id + 1,
    next_milestone: {
      deadline: dayjs()
        .add(Math.ceil(Math.random() * 500), 'hour')
        .format(),
      title: chance.pickone(milestones),
    },
    people: chance.pickset(people, chance.pickone([1, 1, 2, 2, 3, 6])),
    summary: chance.sentence({ words: 10 }),
    updated_at: dayjs()
      .subtract(dayjs().diff(dayjs(created_at), 'minute') / 2, 'minute')
      .format(),
  });
});

export { dummyTableData };
