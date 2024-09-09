export type PointData = [number, number];

export type Visit = {
  id: string;
  note: string;
  timestamp: string;
  visitor_id: number;
};

export type ZetkinArea = {
  description: string | null;
  id: string;
  organization: {
    id: number;
  };
  points: PointData[];
  title: string | null;
};

export type ZetkinPlace = {
  description: string | null;
  id: string;
  orgId: number;
  position: { lat: number; lng: number };
  title: string | null;
  type: 'address' | 'misc';
  visits: Visit[];
};

export type ZetkinAreaPostBody = Partial<Omit<ZetkinArea, 'id'>>;

export type ZetkinPlacePostBody = Partial<Omit<ZetkinPlace, 'id'>>;
