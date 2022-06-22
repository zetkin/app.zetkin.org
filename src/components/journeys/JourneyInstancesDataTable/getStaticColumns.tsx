import { GridColDef } from '@mui/x-data-grid-pro';

import JourneyInstanceTitle from 'components/journeys/JourneyInstanceTitle';
import PersonHoverCard from 'components/PersonHoverCard';
import ZetkinDateTime from 'components/ZetkinDateTime';
import ZetkinPerson from 'components/ZetkinPerson';
import ZetkinRelativeTime from 'components/ZetkinRelativeTime';
import {
  ZetkinJourneyInstance,
  ZetkinPerson as ZetkinPersonType,
} from 'types/zetkin';

// Name concatenation
const getPeopleString = (people: ZetkinPersonType[]) =>
  people.map((person) => `${person.first_name} ${person.last_name}`).join(', ');

export const getStaticColumns = (): GridColDef[] => [
  {
    field: 'id',
    renderCell: (params) => {
      const row = params.row as ZetkinJourneyInstance;
      return '#' + row.id.toString();
    },
    width: 100,
  },
  {
    field: 'title',
    renderCell: (params) => {
      const row = params.row as ZetkinJourneyInstance;
      return <JourneyInstanceTitle instance={row} link />;
    },
  },
  {
    field: 'subjects',
    valueGetter: (params) =>
      getPeopleString(params.value as ZetkinPersonType[]),
  },
  {
    field: 'created',
    renderCell: (params) => (
      <ZetkinDateTime convertToLocal datetime={params.value as string} />
    ),
    type: 'date',
  },
  {
    field: 'updated',
    renderCell: (params) => (
      <ZetkinRelativeTime
        convertToLocal
        datetime={params.value as string}
        forcePast
      />
    ),
    type: 'date',
  },
  {
    field: 'nextMilestoneTitle',
    valueGetter: (params) =>
      (params.row as ZetkinJourneyInstance).next_milestone?.title,
  },
  {
    field: 'nextMilestoneDeadline',
    renderCell: (params) => (
      <ZetkinRelativeTime datetime={params.value as string} />
    ),
    type: 'date',
    valueGetter: (params) =>
      (params.row as ZetkinJourneyInstance).next_milestone?.deadline,
  },
  {
    field: 'summary',
  },
  {
    field: 'outcome',
  },
  {
    field: 'assignees',
    renderCell: (params) =>
      (params.row.assignees as ZetkinPersonType[]).map((person) => (
        <PersonHoverCard key={person.id} personId={person.id}>
          <ZetkinPerson
            containerProps={{ style: { marginRight: 10 } }}
            id={person.id}
            link
            name={`${person.first_name} ${person.last_name}`}
            showText={false}
          />
        </PersonHoverCard>
      )),
    valueGetter: (params) =>
      (params.row.assignees as ZetkinPersonType[])
        .map((person) => `${person.first_name} ${person.last_name}`)
        .join(', '),
  },
];
