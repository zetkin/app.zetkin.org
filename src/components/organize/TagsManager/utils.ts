import { TagsGroups } from './types';
import { ZetkinTag } from 'types/zetkin';

export const groupTags = (
  tags: ZetkinTag[],
  localisedUngroupedText: string
): TagsGroups => {
  return tags.reduce((acc: TagsGroups, tag) => {
    // Add to ungrouped tags list
    if (!tag.group) {
      return {
        ...acc,
        ungrouped: {
          tags: acc['ungrouped'] ? [...acc['ungrouped'].tags, tag] : [tag],
          title: localisedUngroupedText,
        },
      };
    }
    // Add to tags list for group
    return {
      ...acc,
      [tag.group.id]: {
        tags: acc[tag.group.id] ? [...acc[tag.group.id].tags, tag] : [tag],
        title: tag.group.title,
      },
    };
  }, {});
};
