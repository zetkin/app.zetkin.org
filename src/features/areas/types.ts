import { ZetkinPerson, ZetkinTag } from 'utils/types/zetkin';

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
  tags: ZetkinTag[];
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
  campaign: {
    id: number;
  };
  id: string;
  organization: {
    id: number;
  };
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
  Omit<ZetkinCanvassAssignment, 'id' | 'campaign' | 'organization'>
> & {
  campaign_id: number;
};
export type ZetkinCanvassAssignmentPatchbody = Partial<
  Omit<ZetkinCanvassAssignment, 'id'>
>;

export type ZetkinCanvassAssignee = {
  canvassAssId: string;
  id: number;
};
export type ZetkinCanvassAssigneePatchBody = Partial<ZetkinCanvassAssignee>;
