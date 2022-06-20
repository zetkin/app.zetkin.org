import Fuse from 'fuse.js';
import { ID_SEARCH_CHAR } from 'components/dataTables/DataTableSearch';
import { ZetkinJourneyInstance } from 'types/zetkin';

interface GetRowsProps {
  journeyInstances: ZetkinJourneyInstance[];
  quickSearch: string;
}

const options = {
  includeScore: true,
  keys: [
    'assigned_to.first_name',
    'assigned_to.last_name',
    'next_milestone.title',
    'people.first_name',
    'people.last_name',
    'summary',
    'tags.value',
    'tags.title',
    'title',
  ],
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
