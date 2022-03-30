import { GridColDef } from '@mui/x-data-grid-pro';
import { IntlShape } from 'react-intl';
import { ZetkinJourneyInstance, ZetkinTag } from 'types/zetkin';

export const getTagColumns = (
  intl: IntlShape,
  rows: ZetkinJourneyInstance[]
): GridColDef[] => {
  const allTags = rows.map((row) => row.tags).flat(1);

  // Get array of unique groups from all group tags
  const allTagGroups: ZetkinTag['group'][] = allTags
    .map((tag) => tag.group)
    .filter((group) => !!group);
  const groups = [...new Map(allTagGroups.map((v) => [v?.id, v])).values()];

  // Get array of unique value titles from all value tags
  const valueTitles = allTags
    .filter((tag) => !tag.group)
    .map((tag) => tag.title)
    .filter((v, i, a) => a.indexOf(v) === i);

  console.log(valueTitles);
  console.log(groups);
  return [];
};
