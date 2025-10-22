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
    numAreaAssignments: number;
    numCallAssignments: number;
    numCalls: number;
    numEmails: number;
    numEmailsSent: number;
    numEventParticipants: number;
    numEvents: number;
    numLists: number;
    numPeople: number;
    numProjects: number;
    numSubmissions: number;
    numSurveys: number;
    numVisits: number;
  };
  title: string;
};
