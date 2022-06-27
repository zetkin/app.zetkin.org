import { JSXElementConstructor } from 'react';
import { FormControl, InputLabel, Select } from '@material-ui/core';
import { GridColDef, GridFilterInputValueProps } from '@mui/x-data-grid-pro';
import { IntlShape, FormattedMessage as Msg } from 'react-intl';

import JourneyInstanceTitle from 'components/journeys/JourneyInstanceTitle';
import PersonHoverCard from 'components/PersonHoverCard';
import ZetkinDateTime from 'components/ZetkinDateTime';
import ZetkinPerson from 'components/ZetkinPerson';
import ZetkinRelativeTime from 'components/ZetkinRelativeTime';
import {
  ZetkinJourneyInstance,
  ZetkinPerson as ZetkinPersonType,
} from 'types/zetkin';

const TestValueInput: JSXElementConstructor<
  GridFilterInputValueProps & { subjects?: ZetkinPersonType[] }
> = ({ applyValue, item, subjects }) => {
  return (
    <FormControl>
      <InputLabel>
        <Msg id="misc.journeys.journeyInstancesFilters.personLabel" />
      </InputLabel>
      <Select
        native
        onChange={(event) => applyValue({ ...item, value: event.target.value })}
        value={item.value}
      >
        <option value=""></option>
        {subjects?.map((subject) => (
          <option key={subject.id} value={subject.id}>
            {fullName(subject)}
          </option>
        ))}
      </Select>
    </FormControl>
  );
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
  const uniqueSubjects = Object.values(peopleById).sort((p0, p1) =>
    fullName(p0).localeCompare(fullName(p1))
  );

  const assigneesById: Record<string, ZetkinPersonType> = {};
  journeyInstances
    .flatMap((instance) => instance.assignees)
    .forEach((assignee) => (assigneesById[assignee.id.toString()] = assignee));
  const uniqueAssignees = Object.values(assigneesById).sort((a0, a1) =>
    fullName(a0).localeCompare(fullName(a1))
  );

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
          InputComponent: TestValueInput,
          InputComponentProps: { subjects: uniqueSubjects },
          getApplyFilterFn: (item) => {
            return (params) => {
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
        },
        {
          InputComponent: TestValueInput,
          InputComponentProps: { subjects: uniqueSubjects },
          getApplyFilterFn: (item) => {
            return (params) => {
              if (!item.value) {
                return true;
              }
              const people = params.value as ZetkinPersonType[];

              return !!people.find((person) => {
                return person.id.toString() !== item.value;
              });
            };
          },
          label: intl.formatMessage({
            id: 'misc.journeys.journeyInstancesFilters.excludesOperator',
          }),
          value: 'doesNotInclude',
        },
      ],
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
          InputComponent: TestValueInput,
          InputComponentProps: { subjects: uniqueAssignees },
          getApplyFilterFn: (item) => {
            return (params) => {
              if (!item.value) {
                return true;
              }
              const assignees = params.value as ZetkinPersonType[];

              return !!assignees.find((assignee) => {
                return assignee.id.toString() === item.value;
              });
            };
          },
          label: intl.formatMessage({
            id: 'misc.journeys.journeyInstancesFilters.includesOperator',
          }),
          value: 'includes',
        },
        {
          InputComponent: TestValueInput,
          InputComponentProps: { subjects: uniqueAssignees },
          getApplyFilterFn: (item) => {
            return (params) => {
              if (!item.value) {
                return true;
              }
              const assignees = params.value as ZetkinPersonType[];

              return !!assignees.find((assignee) => {
                return assignee.id.toString() !== item.value;
              });
            };
          },
          label: intl.formatMessage({
            id: 'misc.journeys.journeyInstancesFilters.excludesOperator',
          }),
          value: 'doesNotInclude',
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
      valueFormatter: (params) =>
        getPeopleString(params.value as ZetkinPersonType[]),
    },
  ];
};
