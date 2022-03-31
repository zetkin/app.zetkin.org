import { ColumnNames } from './getColumns';
import { GridColDef } from '@mui/x-data-grid-pro';
import { TagMetadata } from 'pages/api/organize/[orgId]/journeys/[journeyId]/getTagMetadata';

const getTagColumns = (
  tagMetadata: TagMetadata,
  columnNames: ColumnNames
): GridColDef[] => {
  const { groups, valueTags } = tagMetadata;
  const groupColumns: GridColDef[] = groups.map((group) => ({
    field: `tagGroup${group?.id}`,
    headerName: group?.title,
  }));

  const valueColumns: GridColDef[] = valueTags.map((tag) => ({
    field: `valueTag${tag.id}`,
    headerName: tag.title,
  }));

  const freeTagColumn: GridColDef = {
    field: 'tagsFree',
    headerName: columnNames['tagsFree'],
  };

  return groupColumns.concat(valueColumns).concat(freeTagColumn);
};

export default getTagColumns;
