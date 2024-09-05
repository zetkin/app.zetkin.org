export type PointData = [number, number];
type MarkerData = {
  numberOfActions: number;
  position: { lat: number; lng: number };
};

export type ZetkinArea = {
  description: string | null;
  id: string;
  markers: MarkerData[];
  numberOfActions: number;
  organization: {
    id: number;
  };
  points: PointData[];
  title: string | null;
};

export type ZetkinAreaPostBody = Partial<Omit<ZetkinArea, 'id'>>;
