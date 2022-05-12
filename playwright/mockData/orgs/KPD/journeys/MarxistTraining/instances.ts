import Chance from 'chance';
import dayjs from 'dayjs';
import { uniqBy } from 'lodash';

import mockJourneyInstance from 'utils/testing/mocks/mockJourneyInstance';
import mockOrganization from 'utils/testing/mocks/mockOrganization';
import mockPerson from 'utils/testing/mocks/mockPerson';
import mockTag from 'utils/testing/mocks/mockTag';
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
    {
      color: 'salmon',
      organization: mockOrganization(),
      title: '1 - immediate',
    },
    {
      color: 'peachpuff',
      organization: mockOrganization(),
      title: '2 - near future',
    },
    {
      color: 'lightgray',
      organization: mockOrganization(),
      title: '3 - chase up',
    },
  ].map((tag) => ({
    description: '',
    group: {
      id: groupIds[0],
      organization: mockOrganization(),
      title: 'Priority',
    },
    hidden: false,
    id: ids.shift() as number,
    value_type: null,
    ...tag,
  })),
  [
    { color: 'beige', organization: mockOrganization(), title: 'contract' },
    { color: 'cornflowerblue', organization: mockOrganization(), title: 'pay' },
    {
      color: 'gray',
      organization: mockOrganization(),
      title: 'disciplinary/dismissal',
    },
    {
      color: 'aliceblue',
      organization: mockOrganization(),
      title: 'discrimination',
    },
    {
      color: 'aquamarine',
      organization: mockOrganization(),
      title: 'whistleblowing',
    },
  ].map((tag) => ({
    description: '',
    group: {
      id: groupIds[1],
      organization: mockOrganization(),
      title: 'Category',
    },
    hidden: false,
    id: ids.shift() as number,
    value_type: null,
    ...tag,
  })),
];

const animalTags = uniqBy(
  ids.splice(0, 100).map((id) =>
    mockTag({
      color: chance.color(),
      group: {
        id: groupIds[2],
        organization: mockOrganization(),
        title: 'Animals',
      },
      id,
      title: chance.animal(),
    })
  ),
  'title'
);

const valueTagId = ids.shift();
const getValueTag = (): ZetkinJourneyInstance['tags'] => [
  {
    color: 'green',
    description: '',
    group: null,
    hidden: false,
    id: valueTagId as number,
    organization: mockOrganization(),
    title: 'Number of pets',
    value: chance.integer({ max: 11, min: 0 }),
    value_type: null,
  },
];

const getMultipleTagsGroup = (): ZetkinJourneyInstance['tags'] =>
  chance.pickset(animalTags, chance.integer({ max: 5, min: 2 }));

const getFreeTags = (numTags: number): ZetkinJourneyInstance['tags'] =>
  ids.splice(0, numTags).map((id) => ({
    color: chance.color(),
    description: '',
    group: null,
    hidden: false,
    id,
    organization: mockOrganization(),
    title: chance.word(),
    value_type: null,
  }));

const dummyTableData = ids.splice(0, 500).map((id) => {
  const created = dayjs()
    .subtract(Math.ceil(Math.random() * 200), 'hour')
    .format();

  return mockJourneyInstance({
    assignees: chance.pickset(people, chance.pickone([1, 1, 1, 1, 2])),
    created,
    id: id + 1,
    next_milestone: {
      completed: null,
      deadline: dayjs()
        .add(Math.ceil(Math.random() * 500), 'hour')
        .format(),
      description: '',
      id: ids.shift() as number,
      title: chance.pickone(milestones),
    },
    subjects: chance.pickset(people, chance.pickone([1, 1, 1, 1, 2])),
    summary: chance.sentence({ words: 10 }),
    tags: groupTags
      .map((tags) => chance.pickone(tags))
      .concat(getValueTag())
      .concat(getMultipleTagsGroup())
      .concat(getFreeTags(chance.integer({ max: 5, min: 0 }))),
    updated: dayjs()
      .subtract(dayjs().diff(dayjs(created), 'minute') / 2, 'minute')
      .format(),
  });
});

export { dummyTableData };
