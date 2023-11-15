export type CellData = string | number | null;

export type ImportedFile = {
  selectedSheetIndex: number;
  sheets: Sheet[];
  title: string;
};

export type Sheet = {
  columns: Column[];
  currentlyConfiguring: ConfiguringData | null;
  firstRowIsHeaders: boolean;
  rows: Row[];
  title: string;
};

export type Row = {
  data: CellData[];
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
  selected: boolean;
  title: string;
}

export interface MappingResults {
  numMappedTo: number;
  numPeople: number;
}

export type ConfiguringData = {
  columnId: number;
  type: FieldTypes;
} | null;
