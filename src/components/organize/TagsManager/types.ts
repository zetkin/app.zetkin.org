import { ZetkinTag, ZetkinTagReqBody } from 'types/zetkin';

export interface TagsGroups {
  [key: string]: {
    tags: ZetkinTag[];
    title: string;
  };
}

export type OnCreateTagHandler = (tag: ZetkinTagReqBody) => void;
