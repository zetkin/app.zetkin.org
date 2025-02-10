import { ZetkinPerson } from 'utils/types/zetkin';

export type MergePostBody = {
  objects: number[];
  override: Partial<ZetkinPerson>;
  type: 'person';
};
