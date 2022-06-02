import { FormattedMessage } from 'react-intl';
import { GridColDef } from '@mui/x-data-grid-pro';

import TagChip from 'components/organize/TagManager/components/TagChip';
import {
  JourneyTagColumnData,
  JourneyTagColumnType,
  makeJourneyTagColumn,
} from 'utils/journeyInstanceUtils';
import { ZetkinJourneyInstance, ZetkinTag } from 'types/zetkin';

const getTagColumns = (tagColumns: JourneyTagColumnData[]): GridColDef[] => {
  const colDefs: GridColDef[] = [];

  tagColumns.forEach((colData) => {
    const col = makeJourneyTagColumn(colData);

    if (col.type == JourneyTagColumnType.TAG_GROUP) {
      colDefs.push({
        field: `tagGroup${col.group.id}`,
        headerName: col.group.title,
        renderCell: (params) => {
          return col
            .tagsGetter(params.row as ZetkinJourneyInstance)
            .map((tag) => (
              <TagChip key={tag.id} size="small" tag={tag as ZetkinTag} />
            ));
        },
        valueGetter: (params) =>
          col
            .tagsGetter(params.row as ZetkinJourneyInstance)
            .map((tag) => tag.title)
            .join(', '),
      });
    } else if (col.type == JourneyTagColumnType.VALUE_TAG) {
      colDefs.push({
        field: `valueTag${col.tag.id}`,
        headerName: col.tag.title,
        valueGetter: (params) =>
          col.valueGetter(params.row as ZetkinJourneyInstance),
      });
    } else if (col.type == JourneyTagColumnType.UNSORTED) {
      colDefs.push({
        field: 'tagsFree',
        renderCell: (params) =>
          col
            .tagsGetter(params.row as ZetkinJourneyInstance)
            .map((tag) => (
              <TagChip key={tag.id} size="small" tag={tag as ZetkinTag} />
            )),
        renderHeader: () => (
          <div className="MuiDataGrid-columnHeaderTitle">
            <FormattedMessage
              id={`pages.organizeJourneyInstances.columns.tagsFree`}
            />
          </div>
        ),
        valueGetter: (params) =>
          col
            .tagsGetter(params.row as ZetkinJourneyInstance)
            .map((tag) => tag.title)
            .join(', '),
      });
    }
  });

  return colDefs;
};

export default getTagColumns;
