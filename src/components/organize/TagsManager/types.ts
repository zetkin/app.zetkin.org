import { ZetkinTag } from 'types/zetkin';

export interface TagsGroups {
  [key: string]: {
    tags: ZetkinTag[];
    title: string;
  };
}
