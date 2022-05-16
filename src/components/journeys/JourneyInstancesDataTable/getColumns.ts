import { GridColDef } from '@mui/x-data-grid-pro';

import { getStaticColumns } from './getStaticColumns';
import getTagColumns from './getTagColumns';
import { TagMetadata } from 'utils/getTagMetadata';

const getColumns = (tagMetadata: TagMetadata): GridColDef[] => {
  const staticColumns = getStaticColumns();
  return (
    staticColumns
      .splice(0, 2)
      .concat(getTagColumns(tagMetadata))
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
