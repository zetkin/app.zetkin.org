import { IntlShape } from 'react-intl';
import { Link } from '@mui/material';
import NextLink from 'next/link';
import {
  GridCellParams,
  GridCellValue,
  GridColDef,
  GridFilterItem,
  GridFilterOperator,
} from '@mui/x-data-grid-pro';

import FilterValueSelect from './FilterValueSelect';
import JourneyInstanceTitle from 'features/journeys/components/JourneyInstanceTitle';
import ZUIDateTime from 'zui/ZUIDateTime';
import ZUIPerson from 'zui/ZUIPerson';
import ZUIPersonHoverCard from 'zui/ZUIPersonHoverCard';
import ZUIRelativeTime from 'zui/ZUIRelativeTime';
import {
  ZetkinJourneyInstance,
  ZetkinPerson as ZetkinPersonType,
} from 'utils/types/zetkin';

function makeSelectFilterOperator(
  intl: IntlShape,
  operatorLabelMsgId: string,
  operatorValue: string,
  selectMsgId: string,
  options: { id: number; title: string }[],
  optionMatches: (item: GridFilterItem, params: GridCellParams) => boolean
): GridFilterOperator {
  return {
    InputComponent: FilterValueSelect,
    InputComponentProps: {
      labelMessageId: selectMsgId,
      options,
    },
    getApplyFilterFn: (item) => {
      return (params: GridCellParams) => {
        if (!item.value) {
          return true;
        }

        return optionMatches(item, params);
      };
    },
    label: intl.formatMessage({ id: operatorLabelMsgId }),
    value: operatorValue,
  };
}

function makeDoesNotIncludeFilterOperator(
  intl: IntlShape,
  labelMsgId: string,
  options: { id: number; title: string }[]
): GridFilterOperator {
  return makeSelectFilterOperator(
    intl,
    'misc.journeys.journeyInstancesFilters.doesNotIncludeOperator',
    'doesNotInclude',
    labelMsgId,
    options,
    (item, params) => {
      const people = params.value as ZetkinPersonType[];
      return !people.find((person) => {
        return person.id.toString() === item.value;
      });
    }
  );
}

function makeIncludesFilterOperator(
  intl: IntlShape,
  labelMsgId: string,
  options: { id: number; title: string }[]
): GridFilterOperator {
  return makeSelectFilterOperator(
    intl,
    'misc.journeys.journeyInstancesFilters.includesOperator',
    'includes',
    labelMsgId,
    options,
    (item, params) => {
      const people = params.value as ZetkinPersonType[];
      return !!people.find((person) => {
        return person.id.toString() === item.value;
      });
    }
  );
}

function makeEmptyFilterOperator(intl: IntlShape): GridFilterOperator {
  return {
    getApplyFilterFn: () => {
      return (params: GridCellParams) => {
        const people = params.value as ZetkinPersonType[];
        return people.length === 0;
      };
    },
    label: intl.formatMessage({
      id: 'misc.journeys.journeyInstancesFilters.isEmptyOperator',
    }),
    value: 'isEmpty',
  };
}

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

function getUniqueById<T extends { id: number }>(objects: T[]): T[] {
  const objectsById: Record<number, T> = {};
  objects.forEach((object) => (objectsById[object.id] = object));
  return Object.values(objectsById);
}

const fullName = (person: ZetkinPersonType) =>
  `${person.first_name} ${person.last_name}`;

// Name concatenation
const getPeopleString = (people: ZetkinPersonType[]) =>
  people.map((person) => fullName(person)).join(', ');

export const getStaticColumns = (
  intl: IntlShape,
  journeyInstances: ZetkinJourneyInstance[]
): GridColDef[] => {
  const uniqueSubjects = getUniqueById(
    journeyInstances.flatMap((instance) => instance.subjects)
  )
    .sort((p0, p1) => fullName(p0).localeCompare(fullName(p1)))
    .map((subject) => ({ id: subject.id, title: fullName(subject) }));

  const uniqueAssignees = getUniqueById(
    journeyInstances.flatMap((instance) => instance.assignees)
  )
    .sort((a0, a1) => fullName(a0).localeCompare(fullName(a1)))
    .map((assignee) => ({ id: assignee.id, title: fullName(assignee) }));

  const uniqueMilestones = getUniqueById(
    journeyInstances
      .filter((instance) => !!instance.next_milestone)
      .map((instance) => instance.next_milestone!)
  )
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
        return (
          <NextLink
            href={`/organize/${row.organization.id}/journeys/${row.journey.id}/${row.id}`}
            passHref
          >
            <Link color="inherit" underline="hover">
              {'#' + row.id.toString()}
            </Link>
          </NextLink>
        );
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
        makeDoesNotIncludeFilterOperator(
          intl,
          'misc.journeys.journeyInstancesFilters.doesNotIncludeOperator',
          uniqueSubjects
        ),
        makeEmptyFilterOperator(intl),
      ],
      sortComparator: (value0, value1) => sortByName(value0, value1),
      valueFormatter: (params) =>
        getPeopleString(params.value as ZetkinPersonType[]),
    },
    {
      field: 'created',
      renderCell: (params) => (
        <ZUIDateTime convertToLocal datetime={params.value as string} />
      ),
      type: 'date',
    },
    {
      field: 'updated',
      renderCell: (params) => (
        <ZUIRelativeTime
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
        makeSelectFilterOperator(
          intl,
          'misc.journeys.journeyInstancesFilters.isOperator',
          'is',
          'misc.journeys.journeyInstancesFilters.milestoneLabel',
          uniqueMilestones,
          (item, params) =>
            (
              params.row as ZetkinJourneyInstance
            ).next_milestone?.id.toString() === item.value
        ),
        makeSelectFilterOperator(
          intl,
          'misc.journeys.journeyInstancesFilters.isNotOperator',
          'isNot',
          'misc.journeys.journeyInstancesFilters.milestoneLabel',
          uniqueMilestones,
          (item, params) =>
            (
              params.row as ZetkinJourneyInstance
            ).next_milestone?.id.toString() !== item.value
        ),
      ],
      valueGetter: (params) =>
        (params.row as ZetkinJourneyInstance).next_milestone?.title,
    },
    {
      field: 'nextMilestoneDeadline',
      renderCell: (params) =>
        params.value ? (
          <ZUIRelativeTime datetime={params.value as string} />
        ) : null,
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
        makeDoesNotIncludeFilterOperator(
          intl,
          'misc.journeys.journeyInstancesFilters.doesNotIncludeOperator',
          uniqueAssignees
        ),
        makeEmptyFilterOperator(intl),
      ],
      renderCell: (params) =>
        (params.row.assignees as ZetkinPersonType[]).map((person) => (
          <ZUIPersonHoverCard key={person.id} personId={person.id}>
            <ZUIPerson
              containerProps={{ style: { marginRight: 10 } }}
              id={person.id}
              link
              name={`${person.first_name} ${person.last_name}`}
              showText={false}
            />
          </ZUIPersonHoverCard>
        )),
      sortComparator: (value0, value1) => sortByName(value0, value1),
      valueFormatter: (params) =>
        getPeopleString(params.value as ZetkinPersonType[]),
    },
  ];
};
