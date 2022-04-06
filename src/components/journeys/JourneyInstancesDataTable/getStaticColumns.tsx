import dayjs from 'dayjs';
import { GridColDef } from '@mui/x-data-grid-pro';

import { ColumnNames } from './getColumns';
import ZetkinPerson from 'components/ZetkinPerson';
import ZetkinRelativeTime from 'components/ZetkinRelativeTime';
import { ZetkinJourney, ZetkinPerson as ZetkinPersonType } from 'types/zetkin';

// Name concatenation
const getPeopleString = (people: ZetkinPersonType[]) =>
  people.map((person) => `${person.first_name} ${person.last_name}`).join(', ');

export const getStaticColumns = (
  journey: ZetkinJourney,
  columnNames: ColumnNames
): GridColDef[] => {
  const staticColumns: GridColDef[] = [
    {
      field: 'id',
      valueFormatter: (params) => {
        return `${journey.singular_name} #${params.value}`;
      },
    },
    {
      field: 'people',
      valueGetter: (params) =>
        getPeopleString(params.value as ZetkinPersonType[]),
    },
    {
      field: 'created_at',
      type: 'date',
      valueFormatter: (params) =>
        dayjs(params.value as string).format('MMMM D, YYYY'),
    },
    {
      field: 'updated_at',
      renderCell: (params) => (
        <ZetkinRelativeTime datetime={params.value as string} />
      ),
      type: 'date',
    },
    {
      field: 'next_milestone_title',
      valueGetter: (params) => params.row.next_milestone.title,
    },
    {
      field: 'next_milestone_deadline',
      renderCell: (params) => (
        <ZetkinRelativeTime datetime={params.value as string} />
      ),
      type: 'date',
      valueGetter: (params) => params.row.next_milestone.deadline,
    },
    {
      field: 'summary',
    },
    {
      field: 'assigned_to',
      renderCell: (params) =>
        (params.row.assigned_to as ZetkinPersonType[]).map((person) => (
          <ZetkinPerson
            key={person.id}
            containerProps={{ style: { marginRight: 10 } }}
            id={person.id}
            link
            name={`${person.first_name} ${person.last_name}`}
            showText={false}
          />
        )),
      valueGetter: (params) =>
        (params.row.assigned_to as ZetkinPersonType[])
          .map((person) => `${person.first_name} ${person.last_name}`)
          .join(', '),
    },
  ];

  // Add header names
  return staticColumns
    .filter((staticColumn) =>
      Object.keys(columnNames).includes(staticColumn.field)
    )
    .map((col) => ({
      headerName: columnNames[col.field],
      ...col,
    }));
};
