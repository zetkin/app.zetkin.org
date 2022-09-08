import {
  ZetkinTagGroup,
  ZetkinTagPatchBody,
  ZetkinTagPostBody,
} from 'utils/types/zetkin';

export type NewTagGroup = { title: string };
export type TagWithNewGroup<Tag> = Tag & { group: NewTagGroup };

export type NewTag = ZetkinTagPostBody | TagWithNewGroup<ZetkinTagPostBody>;
export type EditTag = ZetkinTagPatchBody | TagWithNewGroup<ZetkinTagPatchBody>;

export interface ZetkinTagGroupPostBody
  extends Partial<Omit<ZetkinTagGroup, 'id'>> {
  title: string;
}

export type OnCreateTagHandler = (tag: NewTag) => void;
