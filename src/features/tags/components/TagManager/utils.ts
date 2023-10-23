import { ZetkinTag } from 'utils/types/zetkin';

export const DEFAULT_TAG_COLOR = '#e1e1e1';

interface GroupedTagsHashmap {
  [key: string]: {
    id: number | 'ungrouped';
    tags: ZetkinTag[];
    title: string;
  };
}

export const groupTags = (
  tags: ZetkinTag[],
  localisedUngroupedText: string
): { id: number | 'ungrouped'; tags: ZetkinTag[]; title: string }[] => {
  const groupedTags: GroupedTagsHashmap = tags.reduce(
    (acc: GroupedTagsHashmap, tag) => {
      // Add to ungrouped tags list
      if (!tag.group) {
        return {
          ...acc,
          ungrouped: {
            id: 'ungrouped',
            tags: acc['ungrouped'] ? [...acc['ungrouped'].tags, tag] : [tag],
            title: localisedUngroupedText,
          },
        };
      }
      // Add to tags list for group
      return {
        ...acc,
        [tag.group.id]: {
          id: tag.group.id,
          tags: acc[tag.group.id] ? [...acc[tag.group.id].tags, tag] : [tag],
          title: tag.group.title,
        },
      };
    },
    {}
  );

  // Sort tags within groups
  Object.values(groupedTags).forEach((group) =>
    group.tags.sort((tag0, tag1) => tag0.title.localeCompare(tag1.title))
  );

  const { ungrouped, ...grouped } = groupedTags;

  const sortedGroupedTags = Object.values(grouped).sort((group0, group1) =>
    group0.title.localeCompare(group1.title)
  );

  if (ungrouped) {
    return [...sortedGroupedTags, ungrouped];
  }
  return sortedGroupedTags;
};

export const randomColor = (): string => {
  return Math.floor(Math.random() * 0xffffff)
    .toString(16)
    .padStart(6, '0');
};

export const hexRegex = new RegExp(/^[0-9a-f]{6}$/i);

export const filterTags = (
  options: ZetkinTag[],
  inputValue: string
): ZetkinTag[] => {
  const tokenisedInputValue = inputValue.split(' ');
  return options.filter((option) =>
    // Returns true if every token is found in one of the following matches
    tokenisedInputValue.every((valueWord) => {
      return (
        option.title.toLowerCase().includes(valueWord.toLowerCase()) ||
        option.group?.title.toLowerCase().includes(valueWord.toLowerCase()) ||
        option.description?.toLowerCase().includes(valueWord.toLowerCase())
      );
    })
  );
};
