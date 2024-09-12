export type PointData = [number, number];

export type Visit = {
  id: string;
  note: string;
  timestamp: string;
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

export type ZetkinCanvassAssignment = {
  campId: number;
  id: string;
  orgId: number;
  title: string | null;
};

export type ZetkinAreaPostBody = Partial<Omit<ZetkinArea, 'id'>>;
export type ZetkinPlacePostBody = Partial<Omit<ZetkinPlace, 'id'>>;
export type ZetkinPlacePatchBody = Omit<ZetkinPlacePostBody, 'visits'> & {
  visits?: Omit<Visit, 'id'>[];
};
export type ZetkinCanvassAssignmentPostBody = Partial<
  Omit<ZetkinCanvassAssignment, 'id'>
>;
export type ZetkinCanvassAssignmentPatchbody = ZetkinCanvassAssignmentPostBody;

export type ZetkinIndividualCanvassAssignment = {
  areaUrl: string;
  id: string;
  personId: number;
};
export type ZetkinIndividualCanvassAssignmentPostBody = Partial<
  Omit<ZetkinIndividualCanvassAssignment, 'id'>
>;
export type ZetkinIndividualCanvassAssignmentPatchBody =
  ZetkinIndividualCanvassAssignmentPostBody;
