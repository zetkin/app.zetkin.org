export interface TreeItemData {
  id: number;
  title: string;
  parent: {
    id: number;
    title: string;
  } | null;
  children: TreeItemData[] | [];
}

export type SuborgWithStats = {
  id: number;
  stats: {
    numCalls: number;
    numEmailsSent: number;
    numEventParticipants: number;
    numEventsWithParticipants: number;
    numLists: number;
    numPeople: number;
    numProjects: number;
    numSubmissions: number;
  };
  title: string;
};

export type SuborgError = {
  error: boolean;
  id: string;
};

export type SuborgResult = SuborgWithStats | SuborgError;
