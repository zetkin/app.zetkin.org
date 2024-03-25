import { Link } from '@mui/material';
import NextLink from 'next/link';
import {
  GridCellParams,
  GridColDef,
  GridFilterItem,
  GridFilterOperator,
} from '@mui/x-data-grid-pro';

import FilterValueSelect from './FilterValueSelect';
import JourneyInstanceTitle from 'features/journeys/components/JourneyInstanceTitle';
import { UseMessagesMap } from 'core/i18n';
import ZUIPerson from 'zui/ZUIPerson';
import ZUIPersonHoverCard from 'zui/ZUIPersonHoverCard';
import ZUIRelativeTime from 'zui/ZUIRelativeTime';
import {
  ZetkinJourneyInstance,
  ZetkinPerson as ZetkinPersonType,
} from 'utils/types/zetkin';

import messageIds from 'features/journeys/l10n/messageIds';

function makeSelectFilterOperator(
  operatorLabel: string,
  operatorValue: string,
  selectLabel: string,
  options: { id: number; title: string }[],
  optionMatches: (item: GridFilterItem, params: GridCellParams) => boolean
): GridFilterOperator {
  return {
    InputComponent: FilterValueSelect,
    InputComponentProps: {
      label: selectLabel,
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
    label: operatorLabel,
    value: operatorValue,
  };
}

function makeDoesNotIncludeFilterOperator(
  messages: UseMessagesMap<typeof messageIds>,
  label: string,
  options: { id: number; title: string }[]
): GridFilterOperator {
  return makeSelectFilterOperator(
    messages.instances.filters.doesNotIncludeOperator(),
    'doesNotInclude',
    label,
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
  messages: UseMessagesMap<typeof messageIds>,
  label: string,
  options: { id: number; title: string }[]
): GridFilterOperator {
  return makeSelectFilterOperator(
    messages.instances.filters.includesOperator(),
    'includes',
    label,
    options,
    (item, params) => {
      const people = params.value as ZetkinPersonType[];
      return !!people.find((person) => {
        return person.id.toString() === item.value;
      });
    }
  );
}

function makeEmptyFilterOperator(
  messages: UseMessagesMap<typeof messageIds>
): GridFilterOperator {
  return {
    getApplyFilterFn: () => {
      return (params: GridCellParams) => {
        const people = params.value as ZetkinPersonType[];
        return people.length === 0;
      };
    },
    label: messages.instances.filters.isEmptyOperator(),
    value: 'isEmpty',
  };
}

const sortByName = (
  value0: readonly ZetkinPersonType[],
  value1: readonly ZetkinPersonType[]
) => {
  const names0 = value0.map(fullName).sort((p0, p1) => p0.localeCompare(p1));
  const names1 = value1.map(fullName).sort((p0, p1) => p0.localeCompare(p1));

  const name0 = names0[0] ?? '';
  const name1 = names1[0] ?? '';

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
  messages: UseMessagesMap<typeof messageIds>,
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
            legacyBehavior
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
          messages,
          messages.instances.filters.personLabel(),
          uniqueSubjects
        ),
        makeDoesNotIncludeFilterOperator(
          messages,
          messages.instances.filters.doesNotIncludeOperator(),
          uniqueSubjects
        ),
        makeEmptyFilterOperator(messages),
      ],
      sortComparator: (value0, value1) => sortByName(value0, value1),
      valueFormatter: (params) =>
        getPeopleString(params.value as ZetkinPersonType[]),
    },
    {
      field: 'created',
      renderCell: (params) => (
        <ZUIRelativeTime
          convertToLocal
          datetime={params.value as string}
          forcePast
        />
      ),
      type: 'date',
      valueFormatter: (params) => new Date(params.value),
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
      valueFormatter: (params) => new Date(params.value),
    },
    {
      field: 'nextMilestoneTitle',
      filterOperators: [
        makeSelectFilterOperator(
          messages.instances.filters.isOperator(),
          'is',
          messages.instances.filters.milestoneLabel(),
          uniqueMilestones,
          (item, params) =>
            (
              params.row as ZetkinJourneyInstance
            ).next_milestone?.id.toString() === item.value
        ),
        makeSelectFilterOperator(
          messages.instances.filters.isNotOperator(),
          'isNot',
          messages.instances.filters.milestoneLabel(),
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
      valueFormatter: (params) => new Date(params.value),
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
          messages,
          messages.instances.filters.personLabel(),
          uniqueAssignees
        ),
        makeDoesNotIncludeFilterOperator(
          messages,
          messages.instances.filters.doesNotIncludeOperator(),
          uniqueAssignees
        ),
        makeEmptyFilterOperator(messages),
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
