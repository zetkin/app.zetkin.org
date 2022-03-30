import { GridColDef } from '@mui/x-data-grid-pro';
import { IntlShape } from 'react-intl';

import { getStaticColumns } from './getStaticColumns';
import { getTagColumns } from './getTagColumns';
import { ZetkinJourney, ZetkinJourneyInstance } from 'types/zetkin';

const getColumns = (
  intl: IntlShape,
  rows: ZetkinJourneyInstance[],
  journey: ZetkinJourney
): GridColDef[] => {
  const staticColumns = getStaticColumns(intl, journey);
  return (
    staticColumns
      .splice(0, 2)
      .concat(getTagColumns(intl, rows))
      // Add/override common props
      .concat(staticColumns)
      .map((col) => ({
        flex: 1,
        minWidth: 200,
        ...col,
      }))
  );
};

// Localised header names
export const getHeaderName = (field: string, intl: IntlShape): string =>
  intl.formatMessage({
    id: `pages.organizeJourney.columns.${field}`,
  });

export default getColumns;
