import { ZetkinJourneyInstance, ZetkinTag, ZetkinTagGroup } from 'types/zetkin';

export enum JourneyTagColumnType {
  VALUE_TAG = 'VALUE_TAG',
  TAG_GROUP = 'TAG_GROUP',
  UNSORTED = 'UNSORTED',
}

interface JourneyValueTagColumnData {
  type: JourneyTagColumnType.VALUE_TAG;
  tag: ZetkinTag;
  header: string;
}

interface JourneyTagGroupColumnData {
  type: JourneyTagColumnType.TAG_GROUP;
  group: ZetkinTagGroup;
  header: string;
}

interface JourneyUnsortedTagsColumnData {
  type: JourneyTagColumnType.UNSORTED;
}

type JourneyUnsortedTagsColumn = JourneyUnsortedTagsColumnData & {
  tagsGetter: (instance: ZetkinJourneyInstance) => ZetkinTag[];
};

type JourneyTagGroupColumn = JourneyTagGroupColumnData & {
  tagsGetter: (instance: ZetkinJourneyInstance) => ZetkinTag[];
};

type JourneyValueTagColumn = JourneyValueTagColumnData & {
  valueGetter: (instance: ZetkinJourneyInstance) => string | number | null;
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
      tagsGetter: (instance: ZetkinJourneyInstance) =>
        instance.tags.filter((tag) => tag.group?.id == colData.group.id),
    };
  } else if (colData.type == JourneyTagColumnType.UNSORTED) {
    return {
      ...colData,
      tagsGetter: (instance: ZetkinJourneyInstance) =>
        instance.tags.filter((tag) => !tag.group),
    };
  } else {
    // Must be VALUE_TAG
    return {
      ...colData,
      valueGetter: (instance: ZetkinJourneyInstance) =>
        instance.tags.find((tag) => tag.id == colData.tag.id)?.value ?? null,
    };
  }
}

export function getTagColumns(
  instances: ZetkinJourneyInstance[]
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
