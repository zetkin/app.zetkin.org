export type CellData = string | number | null;

export type ImportedFile = {
  selectedSheetIndex: number;
  sheets: Sheet[];
  title: string;
};

export type Sheet = {
  columns: Column[];
  firstRowIsHeaders: boolean;
  rows: Row[];
  title: string;
};

export type Row = {
  data: CellData[];
};

export enum ColumnKind {
  FIELD = 'field',
  ID_FIELD = 'id',
  TAG = 'tag',
  ORGANIZATION = 'org',
  UNKNOWN = 'unknown',
}

type BaseColumn = {
  selected: boolean;
};

type UnknownColumn = BaseColumn & {
  kind: ColumnKind.UNKNOWN;
};

type FieldColumn = BaseColumn & {
  field: string;
  kind: ColumnKind.FIELD;
};

type IDFieldColumn = BaseColumn & {
  idField: 'ext_id' | 'id' | null;
  kind: ColumnKind.ID_FIELD;
};

type TagColumn = BaseColumn & {
  kind: ColumnKind.TAG;
  mapping: {
    tagIds: number[];
    value: CellData;
  }[];
};

type OrgColumn = BaseColumn & {
  kind: ColumnKind.ORGANIZATION;
  mapping: {
    orgIds: number[];
    value: CellData;
  };
};

export type Column =
  | UnknownColumn
  | FieldColumn
  | IDFieldColumn
  | TagColumn
  | OrgColumn;

export interface MappingResults {
  numMappedTo: number;
  numRows: number;
}
