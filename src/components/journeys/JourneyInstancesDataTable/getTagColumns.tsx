import { ColumnNames } from './getColumns';
import { GridColDef } from '@mui/x-data-grid-pro';
import { TagMetadata } from 'pages/api/organize/[orgId]/journeys/[journeyId]/getTagMetadata';
import { ZetkinJourneyInstance } from 'types/zetkin';
import ZetkinTag from 'components/ZetkinTag';

const getTagColumns = (
  tagMetadata: TagMetadata,
  columnNames: ColumnNames
): GridColDef[] => {
  const { groups, valueTags } = tagMetadata;

  const getGroupTags = (
    row: Partial<ZetkinJourneyInstance>,
    groupId: number
  ): ZetkinJourneyInstance['tags'] =>
    (row.tags as ZetkinJourneyInstance['tags']).filter(
      (tag) => tag.group?.id === groupId
    );

  const groupColumns: GridColDef[] = groups.map((group) => ({
    field: `tagGroup${group?.id}`,
    headerName: group?.title,
    renderCell: (params) => {
      if (group) {
        return getGroupTags(params.row, group.id).map((tag) => (
          <ZetkinTag
            key={tag.id}
            chipProps={{ style: { marginRight: 5 } }}
            tag={tag}
          />
        ));
      }
    },
    valueGetter: (params) => {
      if (group) {
        return getGroupTags(params.row, group.id)
          .map((tag) => tag.title)
          .join(', ');
      }
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
    renderCell: (params) => {
      const rowTags = params.row.tags as ZetkinJourneyInstance['tags'];
      const freeTags = rowTags.filter((tag) => !tag.group && !('value' in tag));
      return freeTags.map((tag) => (
        <ZetkinTag
          key={tag.id}
          chipProps={{ style: { marginRight: 5 } }}
          tag={tag}
        />
      ));
    },
    valueGetter: (params) => {
      const rowTags = params.row.tags as ZetkinJourneyInstance['tags'];
      const freeTags = rowTags.filter((tag) => !tag.group && !('value' in tag));
      return freeTags.map((tag) => tag.title).join(', ');
    },
  };

  return groupColumns.concat(valueColumns).concat(freeTagColumn);
};

export default getTagColumns;
