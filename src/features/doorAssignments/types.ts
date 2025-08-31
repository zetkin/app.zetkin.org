export type ZetkinDoorAssignment = {
  campaign: {
    id: number;
  };
  id: string;
  organization: {
    id: number;
  };
  title: string | null;
};

export type ZetkinDoorAssignmentPostBody = Partial<
  Omit<ZetkinDoorAssignment, 'id' | 'campaign' | 'organization'>
> & {
  campaign_id: number;
};
