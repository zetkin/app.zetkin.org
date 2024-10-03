import { ZetkinPerson } from 'utils/types/zetkin';

export type CanvassAssignmentStats = {
  numHouseholds: number;
  numPlaces: number;
  numVisitedHouseholds: number;
  numVisitedPlaces: number;
};

export type PointData = [number, number];

export type Visit = {
  canvassAssId: string | null;
  id: string;
  note: string;
  timestamp: string;
};

export type Household = {
  id: string;
  title: string;
  visits: Visit[];
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
  households: Household[];
  id: string;
  orgId: number;
  position: { lat: number; lng: number };
  title: string | null;
  type: 'address' | 'misc';
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
export type ZetkinPlacePostBody = Partial<
  Omit<ZetkinPlace, 'id' | 'households'>
>;

export type ZetkinPlacePatchBody = Partial<
  Omit<ZetkinPlace, 'id' | 'households'>
> & {
  households?: Partial<Omit<Household, 'id' | 'visits'>> &
    { visits?: Partial<Omit<Visit, 'id'>>[] }[];
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

export type HouseholdPatchBody = Partial<Omit<Household, 'id'>>;
