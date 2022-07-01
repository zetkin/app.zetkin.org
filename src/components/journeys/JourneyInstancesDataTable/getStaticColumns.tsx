import { IntlShape } from 'react-intl';
import {
  GridCellParams,
  GridCellValue,
  GridColDef,
  GridFilterItem,
  GridFilterOperator,
} from '@mui/x-data-grid-pro';

import FilterValueSelect from './FilterValueSelect';
import JourneyInstanceTitle from 'components/journeys/JourneyInstanceTitle';
import PersonHoverCard from 'components/PersonHoverCard';
import ZetkinDateTime from 'components/ZetkinDateTime';
import ZetkinPerson from 'components/ZetkinPerson';
import ZetkinRelativeTime from 'components/ZetkinRelativeTime';
import {
  ZetkinJourneyInstance,
  ZetkinJourneyMilestoneStatus,
  ZetkinPerson as ZetkinPersonType,
} from 'types/zetkin';

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

function makeIncludesFilterOperator(
  intl: IntlShape,
  labelMsgId: string,
  options: { id: number; title: string }[]
): GridFilterOperator {
  return {
    InputComponent: FilterValueSelect,
    InputComponentProps: {
      labelMessageId: labelMsgId,
      options,
    },
    getApplyFilterFn: (item) => {
      return (params: GridCellParams) => {
        if (!item.value) {
          return true;
        }
        const people = params.value as ZetkinPersonType[];

        return !!people.find((person) => {
          return person.id.toString() === item.value;
        });
      };
    },
    label: intl.formatMessage({
      id: 'misc.journeys.journeyInstancesFilters.includesOperator',
    }),
    value: 'includes',
  };
}

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

  const milestonesById: Record<string, ZetkinJourneyMilestoneStatus> = {};
  journeyInstances
    .flatMap((instance) => instance.next_milestone)
    .forEach((milestone) => {
      if (milestone) {
        milestonesById[milestone.id.toString()] = milestone;
      }
    });
  const uniqueMilestones = Object.values(milestonesById)
    .sort((m0, m1) => m0.title.localeCompare(m1.title))
    .map((milestone) => ({
      id: milestone.id,
      title: milestone.title,
    }));

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
        makeIncludesFilterOperator(
          intl,
          'misc.journeys.journeyInstancesFilters.personLabel',
          uniqueSubjects
        ),
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
      filterOperators: [
        {
          InputComponent: FilterValueSelect,
          InputComponentProps: {
            labelMessageId:
              'misc.journeys.journeyInstancesFilters.milestoneLabel',
            options: uniqueMilestones,
          },
          getApplyFilterFn: (item) => {
            return (params) => {
              if (!item.value) {
                return true;
              }
              return (
                (
                  params.row as ZetkinJourneyInstance
                ).next_milestone?.id.toString() === item.value
              );
            };
          },
          label: intl.formatMessage({
            id: 'misc.journeys.journeyInstancesFilters.isOperator',
          }),
          value: 'is',
        },
        {
          InputComponent: FilterValueSelect,
          InputComponentProps: {
            labelMessageId:
              'misc.journeys.journeyInstancesFilters.milestoneLabel',
            options: uniqueMilestones,
          },
          getApplyFilterFn: (item) => {
            return (params) => {
              if (!item.value) {
                return true;
              }
              return (
                (
                  params.row as ZetkinJourneyInstance
                ).next_milestone?.id.toString() !== item.value
              );
            };
          },
          label: intl.formatMessage({
            id: 'misc.journeys.journeyInstancesFilters.isNotOperator',
          }),
          value: 'isNot',
        },
      ],
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
        makeIncludesFilterOperator(
          intl,
          'misc.journeys.journeyInstancesFilters.personLabel',
          uniqueAssignees
        ),
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
