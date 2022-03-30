import dayjs from 'dayjs';
import { IntlShape } from 'react-intl';
import {
  GridColDef,
  GridRenderCellParams,
  GridValueFormatterParams,
} from '@mui/x-data-grid-pro';

import ZetkinPerson from 'components/ZetkinPerson';
import { ZetkinJourney, ZetkinPerson as ZetkinPersonType } from 'types/zetkin';

// Localised header names
const getHeaderName = (field: string, intl: IntlShape) =>
  intl.formatMessage({
    id: `pages.organizeJourney.columns.${field}`,
  });

// Name concatenation
const getPeopleString = (people: ZetkinPersonType[]) =>
  people.map((person) => `${person.first_name} ${person.last_name}`).join(', ');

export const getStaticColumns = (
  intl: IntlShape,
  journey: ZetkinJourney
): GridColDef[] => {
  const staticColumns: GridColDef[] = [
    {
      field: 'id',
      valueFormatter: (params: GridValueFormatterParams) => {
        return `${journey.singular_name} #${params.value}`;
      },
    },
    {
      field: 'people',
      valueGetter: (params: GridValueFormatterParams) =>
        getPeopleString(params.value as ZetkinPersonType[]),
    },
    {
      field: 'created_at',
      type: 'date',
      valueFormatter: (params: GridValueFormatterParams) =>
        dayjs(params.value as string).format('MMMM D, YYYY'),
    },
    {
      field: 'updated_at',
      type: 'date',
      valueFormatter: (params: GridValueFormatterParams) =>
        dayjs(params.value as string).fromNow(),
    },
    {
      field: 'next_milestone_title',
      valueGetter: (params: GridValueFormatterParams) =>
        params.row.next_milestone.title,
    },
    {
      field: 'next_milestone_deadline',
      type: 'date',
      valueFormatter: (params: GridValueFormatterParams) =>
        dayjs(params.value as string).fromNow(true),
      valueGetter: (params: GridValueFormatterParams) =>
        params.row.next_milestone.deadline,
    },
    {
      field: 'summary',
    },
    {
      field: 'assigned_to',
      filterable: false,
      renderCell: (params: GridRenderCellParams) =>
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
      sortable: false,
    },
  ];

  // Add common props
  return staticColumns.map((col) => ({
    flex: 1,
    headerName: getHeaderName(col.field, intl),
    minWidth: 200,
    ...col,
  }));
};
