import { IntlShape } from 'react-intl';
import { GridColDef, GridValueFormatterParams } from '@mui/x-data-grid-pro';
import { ZetkinJourney, ZetkinJourneyInstance } from 'types/zetkin';

const getStaticColumns = (intl: IntlShape, journey: ZetkinJourney) => {
  const staticColumns: GridColDef[] = [
    {
      field: 'id',
      flex: 1,
      headerName: intl.formatMessage({
        id: 'pages.organizeJourney.columns.title',
      }),
      valueFormatter: (params: GridValueFormatterParams) => {
        return `${journey.singular_name} #${params.value}`;
      },
    },
  ];

  //

  return staticColumns;
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
