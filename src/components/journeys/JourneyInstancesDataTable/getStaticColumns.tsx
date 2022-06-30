import { IntlShape } from 'react-intl';
import {
  GridCellParams,
  GridCellValue,
  GridColDef,
  GridFilterItem,
} from '@mui/x-data-grid-pro';

import FilterValueSelect from './FilterValueSelect';
import JourneyInstanceTitle from 'components/journeys/JourneyInstanceTitle';
import PersonHoverCard from 'components/PersonHoverCard';
import ZetkinDateTime from 'components/ZetkinDateTime';
import ZetkinPerson from 'components/ZetkinPerson';
import ZetkinRelativeTime from 'components/ZetkinRelativeTime';
import {
  ZetkinJourneyInstance,
  ZetkinPerson as ZetkinPersonType,
} from 'types/zetkin';

const includes = (item: GridFilterItem) => {
  return (params: GridCellParams) => {
    if (!item.value) {
      return true;
    }
    const people = params.value as ZetkinPersonType[];

    return !!people.find((person) => {
      return person.id.toString() === item.value;
    });
  };
};

const doesNotInclude = (item: GridFilterItem) => {
  return (params: GridCellParams) => {
    if (!item.value) {
      return true;
    }
    const assignees = params.value as ZetkinPersonType[];

    return !!assignees.find((assignee) => {
      return assignee.id.toString() !== item.value;
    });
  };
};

const isEmpty = () => {
  return (params: GridCellParams) => {
    const people = params.value as ZetkinPersonType[];
    return people.length === 0;
  };
};

const sortByName = (value0: GridCellValue, value1: GridCellValue) => {
  const names0 = (value0 as ZetkinPersonType[]).sort((p0, p1) =>
    fullName(p0).localeCompare(fullName(p1))
  );
  const names1 = (value1 as ZetkinPersonType[]).sort((p0, p1) =>
    fullName(p0).localeCompare(fullName(p1))
  );

  const name0 = names0[0] ? fullName(names0[0]) : '';
  const name1 = names1[0] ? fullName(names1[0]) : '';

  if (!name0 && !name1) {
    return 0;
  } else if (!name0) {
    return 1;
  } else if (!name1) {
    return -1;
  } else {
    return name0.localeCompare(name1);
  }
};

const fullName = (person: ZetkinPersonType) =>
  `${person.first_name} ${person.last_name}`;

// Name concatenation
const getPeopleString = (people: ZetkinPersonType[]) =>
  people.map((person) => fullName(person)).join(', ');

export const getStaticColumns = (
  intl: IntlShape,
  journeyInstances: ZetkinJourneyInstance[]
): GridColDef[] => {
  const peopleById: Record<string, ZetkinPersonType> = {};
  journeyInstances
    .flatMap((instance) => instance.subjects)
    .forEach((person) => (peopleById[person.id.toString()] = person));
  const uniqueSubjects = Object.values(peopleById)
    .sort((p0, p1) => fullName(p0).localeCompare(fullName(p1)))
    .map((subject) => ({ id: subject.id, title: fullName(subject) }));

  const assigneesById: Record<string, ZetkinPersonType> = {};
  journeyInstances
    .flatMap((instance) => instance.assignees)
    .forEach((assignee) => (assigneesById[assignee.id.toString()] = assignee));
  const uniqueAssignees = Object.values(assigneesById)
    .sort((a0, a1) => fullName(a0).localeCompare(fullName(a1)))
    .map((assignee) => ({ id: assignee.id, title: fullName(assignee) }));

  return [
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
      filterOperators: [
        {
          InputComponent: FilterValueSelect,
          InputComponentProps: {
            labelMessageId: 'misc.journeys.journeyInstancesFilters.personLabel',
            options: uniqueSubjects,
          },
          getApplyFilterFn: (item) => includes(item),
          label: intl.formatMessage({
            id: 'misc.journeys.journeyInstancesFilters.includesOperator',
          }),
          value: 'includes',
        },
        {
          InputComponent: FilterValueSelect,
          InputComponentProps: {
            labelMessageId: 'misc.journeys.journeyInstancesFilters.personLabel',
            options: uniqueSubjects,
          },
          getApplyFilterFn: (item) => doesNotInclude(item),
          label: intl.formatMessage({
            id: 'misc.journeys.journeyInstancesFilters.doesNotIncludeOperator',
          }),
          value: 'doesNotInclude',
        },
        {
          getApplyFilterFn: isEmpty,
          label: intl.formatMessage({
            id: 'misc.journeys.journeyInstancesFilters.isEmptyOperator',
          }),
          value: 'isEmpty',
        },
      ],
      sortComparator: (value0, value1) => sortByName(value0, value1),
      valueFormatter: (params) =>
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
      filterOperators: [
        {
          InputComponent: FilterValueSelect,
          InputComponentProps: {
            labelMessageId: 'misc.journeys.journeyInstancesFilters.personLabel',
            options: uniqueAssignees,
          },
          getApplyFilterFn: (item) => includes(item),
          label: intl.formatMessage({
            id: 'misc.journeys.journeyInstancesFilters.includesOperator',
          }),
          value: 'includes',
        },
        {
          InputComponent: FilterValueSelect,
          InputComponentProps: {
            labelMessageId: 'misc.journeys.journeyInstancesFilters.personLabel',
            options: uniqueAssignees,
          },
          getApplyFilterFn: (item) => doesNotInclude(item),
          label: intl.formatMessage({
            id: 'misc.journeys.journeyInstancesFilters.doesNotIncludeOperator',
          }),
          value: 'doesNotInclude',
        },
        {
          getApplyFilterFn: isEmpty,
          label: intl.formatMessage({
            id: 'misc.journeys.journeyInstancesFilters.isEmptyOperator',
          }),
          value: 'isEmpty',
        },
      ],
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
      sortComparator: (value0, value1) => sortByName(value0, value1),
      valueFormatter: (params) =>
        getPeopleString(params.value as ZetkinPersonType[]),
    },
  ];
};
