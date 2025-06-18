import { Branded } from 'utils/types';
import { ZetkinTag } from 'utils/types/zetkin';

export type Longitude = Branded<number, 'Longitude'>;
export type Latitude = Branded<number, 'Latitude'>;

export type PointData = [Longitude, Latitude];

export type ZetkinArea = {
  description: string;
  id: number;
  organization_id: number;
  points: PointData[];
  tags: ZetkinTag[];
  title: string;
};

export type ZetkinAreaPostBody = Partial<Omit<ZetkinArea, 'id'>>;

export type Zetkin2AreaLine = PointData[];

export type Zetkin2Area = {
  boundary: {
    coordinates: Zetkin2AreaLine[];
    type: 'Polygon';
  };
  description: string;
  id: number;
  organization_id: number;
  title: string;
};

export type Zetkin2AreaPostBody = Partial<
  Omit<Zetkin2Area, 'id' | 'organization_id'>
>;
