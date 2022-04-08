import { uniqBy } from 'lodash';

import { ZetkinJourneyInstance, ZetkinTag } from 'types/zetkin';

export interface TagMetadata {
  groups: ZetkinTag['group'][];
  valueTags: ZetkinJourneyInstance['tags'];
}

export const getTagMetadata = (
  journeyInstances: ZetkinJourneyInstance[]
): TagMetadata => {
  const allTags = journeyInstances
    .map((journeyInstance) => journeyInstance.tags)
    .flat(1);

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

  return { groups, valueTags };
};
