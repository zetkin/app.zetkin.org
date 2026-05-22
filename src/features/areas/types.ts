import { Branded } from 'utils/types/branded';
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

export type ZetkinAreaStats = {
  area_id: number;
  count_households: number;
  count_locations: number;
  count_unique_households_visited: number;
  count_unique_locations_visited: number;
  id: number;

  sum_successful_visits: number;
  sum_visits: number;
};
