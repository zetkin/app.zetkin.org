import { FakeDataType } from '../components/Importer/Validation';
import useTags from 'features/tags/hooks/useTags';
import { ZetkinTag } from 'utils/types/zetkin';

export default function useTagUpdates(
  orgId: number,
  tagsCreated: FakeDataType['summary']['tagsCreated']
) {
  const tags = useTags(orgId).data ?? [];

  const addedTags = Object.keys(tagsCreated.byTag).reduce(
    (acc: ZetkinTag[], id) => {
      const tag = tags.find((tag) => tag.id === parseInt(id));
      if (tag) {
        return acc.concat(tag);
      }
      return acc;
    },
    []
  );

  return {
    addedTags,
    numPeopleWithTagsAdded: tagsCreated.total,
  };
}
