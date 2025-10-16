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
    numCallAssignments: number;
    numCalls: number;
    numPeople: number;
    numSurveys: number;
  };
  title: string;
};
