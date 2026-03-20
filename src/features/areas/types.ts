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
  id: number;
  num_households: number;
  num_households_successfully_visited: number;
  num_households_visited: number;
  num_locations: number;
  num_locations_visited: number;
  num_successfull_visits: number;
};
