import { GridColDef } from '@mui/x-data-grid-pro';

import { getStaticColumns } from './getStaticColumns';
import getTagColumns from './getTagColumns';
import { TagMetadata } from 'utils/getTagMetadata';
import { ZetkinJourney } from 'types/zetkin';

const getColumns = (
  tagMetadata: TagMetadata,
  journey: ZetkinJourney
): GridColDef[] => {
  const staticColumns = getStaticColumns(journey);
  return (
    staticColumns
      .splice(0, 2)
      .concat(getTagColumns(tagMetadata))
      // Add/override common props
      .concat(staticColumns)
      .map((col) => ({
        flex: 1,
        minWidth: 200,
        ...col,
      }))
  );
};

export default getColumns;
