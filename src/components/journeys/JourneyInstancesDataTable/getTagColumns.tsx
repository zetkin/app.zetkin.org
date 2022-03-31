import { ColumnNames } from './getColumns';
import { GridColDef } from '@mui/x-data-grid-pro';
import { TagMetadata } from 'pages/api/organize/[orgId]/journeys/[journeyId]/getTagMetadata';
import { ZetkinJourneyInstance } from '../../../types/zetkin';

const getTagColumns = (
  tagMetadata: TagMetadata,
  columnNames: ColumnNames
): GridColDef[] => {
  const { groups, valueTags } = tagMetadata;
  const groupColumns: GridColDef[] = groups.map((group) => ({
    field: `tagGroup${group?.id}`,
    headerName: group?.title,
    valueGetter: (params) => {
      const rowTags = params.row.tags as ZetkinJourneyInstance['tags'];
      const groupsTags = rowTags.filter((tag) => tag.group?.id === group?.id);
      return groupsTags.map((tag) => tag.title).join(', ');
    },
  }));

  const valueColumns: GridColDef[] = valueTags.map((tag) => ({
    field: `valueTag${tag.id}`,
    headerName: tag.title,
    valueGetter: (params) => {
      const rowTags = params.row.tags as ZetkinJourneyInstance['tags'];
      const valueTags = rowTags.filter((tag) => 'value' in tag);
      return valueTags.map((tag) => tag.value).join('');
    },
  }));

  const freeTagColumn: GridColDef = {
    field: 'tagsFree',
    headerName: columnNames['tagsFree'],
    valueGetter: (params) => {
      const rowTags = params.row.tags as ZetkinJourneyInstance['tags'];
      const freeTags = rowTags.filter((tag) => !tag.group && !('value' in tag));
      return freeTags.map((tag) => tag.title).join(', ');
    },
  };

  return groupColumns.concat(valueColumns).concat(freeTagColumn);
};

export default getTagColumns;
