export interface TreeItemData {
  id: number;
  title: string;
  parent: {
    id: number;
    title: string;
  } | null;
  children: TreeItemData[] | [];
}

export type OrgStats = {
  numCalls: number;
  numEmailsSent: number;
  numEventParticipants: number;
  numEventsWithParticipants: number;
  numLists: number;
  numPeople: number;
  numProjects: number;
  numSubmissions: number;
};

export type SuborgWithStats = {
  id: number;
  stats: OrgStats;
  title: string;
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

export type SuborgResult = SuborgWithStats | SuborgLoadingError;
