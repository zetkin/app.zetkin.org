import { FormattedMessage } from 'react-intl';
import { GridColDef } from '@mui/x-data-grid-pro';
import TagChip from 'components/organize/TagsManager/TagChip';
import { TagMetadata } from 'utils/getTagMetadata';
import { ZetkinJourneyInstance, ZetkinTag } from 'types/zetkin';

const getTagColumns = (tagMetadata: TagMetadata): GridColDef[] => {
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
          <TagChip key={tag.id} tag={tag as ZetkinTag} />
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
    renderCell: (params) => {
      const rowTags = params.row.tags as ZetkinJourneyInstance['tags'];
      const freeTags = rowTags.filter((tag) => !tag.group && !('value' in tag));
      return freeTags.map((tag) => (
        <TagChip key={tag.id} tag={tag as ZetkinTag} />
      ));
    },
    renderHeader: () => (
      <div className="MuiDataGrid-columnHeaderTitle">
        <FormattedMessage
          id={`pages.organizeJourneyInstances.columns.tagsFree`}
        />
      </div>
    ),
    valueGetter: (params) => {
      const rowTags = params.row.tags as ZetkinJourneyInstance['tags'];
      const freeTags = rowTags.filter((tag) => !tag.group && !('value' in tag));
      return freeTags.map((tag) => tag.title).join(', ');
    },
  };

  return groupColumns.concat(valueColumns).concat(freeTagColumn);
};

export default getTagColumns;
