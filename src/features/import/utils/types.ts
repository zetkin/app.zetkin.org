export type CellData = string | number | null;

export type ImportedFile = {
  sheets: Sheet[];
  title: string;
};

export type Sheet = {
  data: Row[];
  title: string;
};

export type Row = {
  data: CellData[];
};

export type ListMeta = {
  items: {
    data: CellData[];
  };
};

export enum FieldTypes {
  BASIC = 'basic',
  ID = 'id',
  ORGANIZATION = 'organization',
  TAG = 'tag',
}

export interface Field {
  id: number;
  slug: string;
  title: string;
  type: FieldTypes;
}

export interface Column {
  data: CellData[];
  id: number;
  title: string;
}

export interface MappingResults {
  numMappedTo: number;
  numPeople: number;
}
