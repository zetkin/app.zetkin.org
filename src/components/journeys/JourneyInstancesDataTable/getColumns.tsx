import { GridColDef } from '@mui/x-data-grid-pro';
import { IntlShape } from 'react-intl';

import { getStaticColumns } from './getStaticColumns';
import { getTagColumns } from './getTagColumns';
import { ZetkinJourney, ZetkinJourneyInstance } from 'types/zetkin';

export const getColumns = (
  intl: IntlShape,
  rows: ZetkinJourneyInstance[],
  journey: ZetkinJourney
): GridColDef[] => {
  return getStaticColumns(intl, journey).concat(getTagColumns(intl, rows));
};
