export type PointData = [number, number];

export type ZetkinArea = {
  id: string;
  organization: {
    id: number;
  };
  points: PointData[];
};

export type ZetkinAreaPostBody = Partial<Omit<ZetkinArea, 'id'>>;
