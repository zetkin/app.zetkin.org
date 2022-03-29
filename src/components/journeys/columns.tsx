import dayjs from 'dayjs';
import { IntlShape } from 'react-intl';
import {
  GridColDef,
  GridRenderCellParams,
  GridValueFormatterParams,
} from '@mui/x-data-grid-pro';

import ZetkinPerson from 'components/ZetkinPerson';
import {
  ZetkinJourney,
  ZetkinJourneyInstance,
  ZetkinPerson as ZetkinPersonType,
} from 'types/zetkin';

const getHeaderName = (field: string, intl: IntlShape) =>
  intl.formatMessage({
    id: `pages.organizeJourney.columns.${field}`,
  });

const getStaticColumns = (intl: IntlShape, journey: ZetkinJourney) => {
  const staticColumns: GridColDef[] = [
    {
      field: 'id',
      valueFormatter: (params: GridValueFormatterParams) => {
        return `${journey.singular_name} #${params.value}`;
      },
    },
    {
      field: 'people',
      valueFormatter: (params: GridValueFormatterParams) => {
        return (params.value as ZetkinPersonType[])
          .map((person) => `${person.first_name} ${person.last_name}`)
          .join(', ');
      },
    },
    {
      field: 'created_at',
      valueFormatter: (params: GridValueFormatterParams) =>
        dayjs(params.value as string).format('MMMM D, YYYY'),
    },
    {
      field: 'updated_at',
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
      renderCell: (params: GridRenderCellParams) =>
        (params.value as ZetkinPersonType[]).map((person) => (
          <ZetkinPerson
            key={person.id}
            containerProps={{ style: { marginRight: 10 } }}
            id={person.id}
            link
            name={`${person.first_name} ${person.last_name}`}
            showText={false}
          />
        )),
    },
  ];

  //

  return staticColumns.map((col) => ({
    flex: 1,
    headerName: getHeaderName(col.field, intl),
    minWidth: 200,
    ...col,
  }));
};

const getTagColumns = (intl: IntlShape, rows: ZetkinJourneyInstance[]) => {
  return [];
};

export const getColumns = (
  intl: IntlShape,
  rows: ZetkinJourneyInstance[],
  journey: ZetkinJourney
): GridColDef[] => {
  return getStaticColumns(intl, journey).concat(getTagColumns(intl, rows));
};
