import { GridColDef } from '@mui/x-data-grid-pro';
import { IntlShape } from 'react-intl';
import { uniqBy } from 'lodash';

import { getHeaderName } from './getColumns';
import { ZetkinJourneyInstance, ZetkinTag } from 'types/zetkin';

export const getTagColumns = (
  intl: IntlShape,
  rows: ZetkinJourneyInstance[]
): GridColDef[] => {
  const allTags = rows.map((row) => row.tags).flat(1);

  // Get array of unique groups by id
  const allTagGroups: ZetkinTag['group'][] = allTags
    .filter((tag) => !!tag.group)
    .map((tag) => tag.group);
  const groups = uniqBy(allTagGroups, 'id');

  // Get array of unique value tags by id
  const valueTags = uniqBy(
    allTags.filter((tag) => 'value' in tag),
    'id'
  );

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
    headerName: getHeaderName('tagsFree', intl),
  };

  return groupColumns.concat(valueColumns).concat(freeTagColumn);
};
