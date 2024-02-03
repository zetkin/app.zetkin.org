import {
  ZetkinJourneyInstance,
  ZetkinTag,
  ZetkinTagGroup,
} from 'utils/types/zetkin';

export enum JourneyTagColumnType {
  VALUE_TAG = 'VALUE_TAG',
  TAG_GROUP = 'TAG_GROUP',
  UNSORTED = 'UNSORTED',
}

export interface JourneyValueTagColumnData {
  type: JourneyTagColumnType.VALUE_TAG;
  tag: ZetkinTag;
  header: string;
}

export interface JourneyTagGroupColumnData {
  type: JourneyTagColumnType.TAG_GROUP;
  group: ZetkinTagGroup;
  header: string;
}

export interface JourneyUnsortedTagsColumnData {
  type: JourneyTagColumnType.UNSORTED;
}

export type JourneyUnsortedTagsColumn = JourneyUnsortedTagsColumnData & {
  tagsGetter: (allTags: ZetkinJourneyInstance['tags']) => ZetkinTag[];
};

export type JourneyTagGroupColumn = JourneyTagGroupColumnData & {
  tagsGetter: (allTags: ZetkinJourneyInstance['tags']) => ZetkinTag[];
};

export type JourneyValueTagColumn = JourneyValueTagColumnData & {
  valueGetter: (
    instance: Pick<ZetkinJourneyInstance, 'tags'>
  ) => string | number | null;
};

export type JourneyTagColumnData =
  | JourneyValueTagColumnData
  | JourneyTagGroupColumnData
  | JourneyUnsortedTagsColumnData;

export type JourneyTagColumn =
  | JourneyValueTagColumn
  | JourneyTagGroupColumn
  | JourneyUnsortedTagsColumn;

export function makeJourneyTagColumn(
  colData: JourneyTagColumnData
): JourneyTagColumn {
  if (colData.type == JourneyTagColumnType.TAG_GROUP) {
    return {
      ...colData,
      tagsGetter: (allTags: ZetkinJourneyInstance['tags']) =>
        allTags.filter(
          (tag) => tag.group?.id == colData.group.id && !tag.value_type
        ),
    };
  } else if (colData.type == JourneyTagColumnType.UNSORTED) {
    return {
      ...colData,
      tagsGetter: (allTags: ZetkinJourneyInstance['tags']) =>
        allTags.filter((tag) => !tag.group && !tag.value_type),
    };
  } else {
    // Must be VALUE_TAG
    return {
      ...colData,
      valueGetter: (instance: Pick<ZetkinJourneyInstance, 'tags'>) =>
        instance.tags.find((tag) => tag.id == colData.tag.id)?.value ?? null,
    };
  }
}

export function getTagColumns(
  instances: Pick<ZetkinJourneyInstance, 'tags'>[]
): JourneyTagColumn[] {
  const tagIds = new Set<number>();
  const groupIds = new Set<number>();

  let hasUnsorted = false;
  const valueTags: ZetkinTag[] = [];
  const groups: ZetkinTagGroup[] = [];

  instances.forEach((instance) => {
    instance.tags.forEach((tag) => {
      if (!tagIds.has(tag.id)) {
        if (tag.value_type) {
          valueTags.push(tag);
        } else if (!tag.group) {
          hasUnsorted = true;
        } else if (!groupIds.has(tag.group.id)) {
          groups.push(tag.group);
          groupIds.add(tag.group.id);
        }
      }

      tagIds.add(tag.id);
    });
  });

  const columns = [
    ...groups.map((group) =>
      makeJourneyTagColumn({
        group: group,
        header: group.title,
        type: JourneyTagColumnType.TAG_GROUP,
      })
    ),
    ...valueTags.map((tag) =>
      makeJourneyTagColumn({
        header: tag.title,
        tag: tag,
        type: JourneyTagColumnType.VALUE_TAG,
      })
    ),
  ];

  if (hasUnsorted) {
    columns.push(makeJourneyTagColumn({ type: JourneyTagColumnType.UNSORTED }));
  }

  return columns;
}
