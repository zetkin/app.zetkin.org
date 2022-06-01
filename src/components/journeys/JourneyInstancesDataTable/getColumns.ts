import { GridColDef } from '@mui/x-data-grid-pro';

import { getStaticColumns } from './getStaticColumns';
import getTagColumns from './getTagColumns';
import { JourneyTagColumnData } from 'utils/journeyInstanceUtils';

const getColumns = (tagColumns: JourneyTagColumnData[]): GridColDef[] => {
  const staticColumns = getStaticColumns();
  return (
    staticColumns
      .splice(0, 2)
      .concat(getTagColumns(tagColumns))
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
