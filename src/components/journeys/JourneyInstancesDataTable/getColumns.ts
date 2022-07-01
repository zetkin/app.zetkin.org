import { GridColDef } from '@mui/x-data-grid-pro';
import { IntlShape } from 'react-intl';

import { getStaticColumns } from './getStaticColumns';
import getTagColumns from './getTagColumns';
import { JourneyTagColumnData } from 'utils/journeyInstanceUtils';
import { ZetkinJourneyInstance } from 'types/zetkin';

const getColumns = (
  intl: IntlShape,
  journeyInstances: ZetkinJourneyInstance[],
  tagColumns: JourneyTagColumnData[]
): GridColDef[] => {
  const staticColumns = getStaticColumns(intl, journeyInstances);
  return (
    staticColumns
      .splice(0, 2)
      .concat(getTagColumns(intl, journeyInstances, tagColumns))
      // Add/override common props
      .concat(staticColumns)
      .map((col) => ({
        minWidth: 50,
        width: 200,
        ...col,
      }))
  );
};

export default getColumns;
