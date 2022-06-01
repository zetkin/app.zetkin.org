import { ZetkinJourneyInstance, ZetkinTag, ZetkinTagGroup } from 'types/zetkin';

export enum JourneyTagColumnType {
  VALUE_TAG,
  TAG_GROUP,
  UNSORTED,
}

interface JourneyValueTagColumn {
  type: JourneyTagColumnType.VALUE_TAG;
  tag: ZetkinTag;
  header: string;
  valueGetter: (instance: ZetkinJourneyInstance) => string | number | null;
}

interface JourneyTagGroupColumn {
  type: JourneyTagColumnType.TAG_GROUP;
  group: ZetkinTagGroup;
  header: string;
  tagsGetter: (instance: ZetkinJourneyInstance) => ZetkinTag[];
}

interface JourneyUnsortedTagsColumn {
  type: JourneyTagColumnType.UNSORTED;
  tagsGetter: (instance: ZetkinJourneyInstance) => ZetkinTag[];
}

type JourneyTagColumn =
  | JourneyValueTagColumn
  | JourneyTagGroupColumn
  | JourneyUnsortedTagsColumn;

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

  const groupColumns: JourneyTagGroupColumn[] = groups.map((group) => ({
    group: group,
    header: group.title,
    tagsGetter: (instance: ZetkinJourneyInstance) =>
      instance.tags.filter((tag) => tag.group?.id == group.id),
    type: JourneyTagColumnType.TAG_GROUP,
  }));

  const valueColumns: JourneyValueTagColumn[] = valueTags.map((tag) => ({
    header: tag.title,
    tag: tag,
    type: JourneyTagColumnType.VALUE_TAG,
    valueGetter: (instance: ZetkinJourneyInstance) =>
      instance.tags.find((tag) => tag.id == tag.id)?.value ?? null,
  }));

  const ungroupedColumn: JourneyUnsortedTagsColumn[] = hasUnsorted
    ? [
        {
          tagsGetter: (instance) => instance.tags.filter((tag) => !tag.group),
          type: JourneyTagColumnType.UNSORTED,
        },
      ]
    : [];

  return [...groupColumns, ...valueColumns, ...ungroupedColumn];
}
