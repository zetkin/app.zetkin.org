import { ZetkinOrganization } from 'utils/types/zetkin';

export type ZetkinPersonNote = {
  author: { id: number; name: string };
  created: string;
  id: number;
  organization: Pick<ZetkinOrganization, 'id' | 'title'>;
  text: string;
};

export type tagAddToPerson = {
  tagId: number;
  tagValue: string | number | null;
};
