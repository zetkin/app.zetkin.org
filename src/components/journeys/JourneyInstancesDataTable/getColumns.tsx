import { GridColDef } from '@mui/x-data-grid-pro';

import { getStaticColumns } from './getStaticColumns';
import getTagColumns from './getTagColumns';
import { TagMetadata } from 'pages/api/organize/[orgId]/journeys/[journeyId]/getTagMetadata';
import { ZetkinJourney } from 'types/zetkin';

export type ColumnNames = Record<string, string>;

const getColumns = (
  columnNames: ColumnNames,
  tagMetadata: TagMetadata,
  journey: ZetkinJourney
): GridColDef[] => {
  const staticColumns = getStaticColumns(journey, columnNames);
  return (
    staticColumns
      .splice(0, 2)
      .concat(getTagColumns(tagMetadata, columnNames))
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
