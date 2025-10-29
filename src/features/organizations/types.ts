export interface TreeItemData {
  id: number;
  title: string;
  parent: {
    id: number;
    title: string;
  } | null;
  children: TreeItemData[] | [];
}

export type SimpleOrgStats = {
  numCalls: number;
  numEmailsSent: number;
  numEventParticipants: number;
  numEventsWithParticipants: number;
  numLists: number;
  numPeople: number;
  numProjects: number;
  numSubmissions: number;
};

export type FullOrgStats = Omit<
  SimpleOrgStats,
  'numEventsWithParticipants' | 'numEventParticipants'
> & {
  numBookedByEventStartDate: Record<string, number>;
};

type SuborgBase = {
  id: number;
  title: string;
};

export type SuborgWithSimpleStats = SuborgBase & {
  stats: SimpleOrgStats;
};

export type SuborgWithFullStats = SuborgBase & {
  stats: FullOrgStats;
};

export type AllSuborgsLoadingError = {
  error: boolean;
  id: string;
};

export type SingleSuborgLoadingError = {
  error: boolean;
  id: number;
};

export type SuborgLoadingError =
  | AllSuborgsLoadingError
  | SingleSuborgLoadingError;

export type SuborgResult = SuborgWithSimpleStats | SuborgLoadingError;
