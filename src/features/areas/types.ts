export type PointData = [number, number];

export type ZetkinArea = {
  id: string;
  points: PointData[];
};

export type ZetkinAreaPostBody = Partial<Omit<ZetkinArea, 'id'>>;
