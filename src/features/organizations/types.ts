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
  numBookedForEvents: number;
  numCalls: number;
  numPeople: number;
  numSubmissions: number;
};

export type FullOrgStats = SimpleOrgStats & {
  numBookedByEventsByStartDate: Record<string, number>;
  numCallsByCallDate: Record<string, number>;
  numEventsWithBookedPeople: number;
  numLists: number;
  numProjects: number;
  numSubmissionsBySubmitDate: Record<string, number>;
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
