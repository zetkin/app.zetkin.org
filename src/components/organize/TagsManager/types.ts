import { ZetkinTag, ZetkinTagGroup, ZetkinTagPostBody } from 'types/zetkin';

export type NewTagGroup = { title: string };

interface TagWithNewGroup
  extends Partial<Omit<ZetkinTag, 'group' | 'organization'>> {
  group: NewTagGroup;
}

export type NewTag = ZetkinTagPostBody | TagWithNewGroup;

export interface ZetkinTagGroupPostBody
  extends Partial<Omit<ZetkinTagGroup, 'id'>> {
  title: string;
}

export type OnCreateTagHandler = (tag: NewTag) => void;

export interface TagsGroups {
  [key: string]: {
    tags: ZetkinTag[];
    title: string;
  };
}
