import { ZetkinTag } from 'utils/types/zetkin';

export type PointData = [number, number];

export type ZetkinArea = {
  description: string | null;
  id: string;
  organization: {
    id: number;
  };
  points: PointData[];
  tags: ZetkinTag[];
  title: string | null;
};

export type ZetkinAreaPostBody = Partial<Omit<ZetkinArea, 'id'>>;
