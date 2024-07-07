import Fuse from 'fuse.js';

import { ID_SEARCH_CHAR } from 'zui/ZUIDataTableSearch';
import { ZetkinJourneyInstance } from 'utils/types/zetkin';

interface GetRowsProps {
  journeyInstances: ZetkinJourneyInstance[];
  quickSearch: string;
}

const options = {
  includeScore: true,
  keys: [
    'assignees.first_name',
    'assignees.last_name',
    'next_milestone.title',
    'subjects.first_name',
    'subjects.last_name',
    'summary',
    'tags.value',
    'tags.title',
    'title',
  ],
  threshold: 0.4,
};

export const getRows = ({
  journeyInstances,
  quickSearch,
}: GetRowsProps): ZetkinJourneyInstance[] => {
  const isIdSearch =
    quickSearch?.length > 1 && quickSearch[0] === ID_SEARCH_CHAR;
  if (quickSearch || isIdSearch) {
    if (isIdSearch) {
      return journeyInstances.filter(
        (instance) =>
          instance.id.toString() === quickSearch.split(ID_SEARCH_CHAR)[1]
      );
    } else {
      const fuse = new Fuse(journeyInstances, options);
      return fuse
        .search(quickSearch)
        .map((fuseResult) => fuseResult.item) as ZetkinJourneyInstance[];
    }
  } else {
    return journeyInstances;
  }
};
