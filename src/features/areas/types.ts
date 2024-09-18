import { ZetkinPerson } from 'utils/types/zetkin';

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

export type ZetkinCanvassSession = {
  area: ZetkinArea;
  assignee: ZetkinPerson;
  assignment: {
    id: string;
    title: string | null;
  };
};

export type ZetkinCanvassSessionPostBody = {
  areaId: string;
  personId: number;
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

export type ZetkinCanvassAssignee = {
  canvassAssId: string;
  id: number;
};
export type ZetkinCanvassAssigneePatchBody = Partial<ZetkinCanvassAssignee>;
