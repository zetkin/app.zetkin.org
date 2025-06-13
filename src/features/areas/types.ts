import { ZetkinTag } from 'utils/types/zetkin';

// Backend format: [lng, lat]
export type PointData = [number, number];

export type ZetkinAreaLine = PointData[];

export type ZetkinArea = {
  boundary: {
    coordinates: ZetkinAreaLine[];
    type: 'Polygon';
  };
  description: string;
  id: number;
  organization_id: number;
  tags: ZetkinTag[];
  title: string;
};

export type ZetkinAreaPostBody = Partial<
  Omit<ZetkinArea, 'id' | 'organization_id'>
>;
