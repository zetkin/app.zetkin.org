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

export type FieldColumn = BaseColumn & {
  field: string;
  kind: ColumnKind.FIELD;
};

export type IDFieldColumn = BaseColumn & {
  idField: 'ext_id' | 'id' | null;
  kind: ColumnKind.ID_FIELD;
};

export type TagColumn = BaseColumn & {
  kind: ColumnKind.TAG;
  mapping: {
    tagIds: number[];
    value: CellData;
  }[];
};

export type OrgColumn = BaseColumn & {
  kind: ColumnKind.ORGANIZATION;
  mapping: {
    orgId: number | null;
    value: CellData;
  }[];
};

export type Column =
  | UnknownColumn
  | FieldColumn
  | IDFieldColumn
  | TagColumn
  | OrgColumn;

export const enum IMPORT_ERROR {
  EMAIL = 'email',
  GENDER = 'gender',
  PHONE = 'phone',
}

export type PersonImportSummary = {
  addedToOrg: {
    byOrg: { [key: number]: number };
    total: number;
  };
  created: {
    total: number;
  };
  tagged: {
    byTag: { [key: number]: number };
    total: number;
  };
  updated: {
    byField: { [key: string]: number };
    total: number;
  };
};

export type PersonImport = {
  summary: PersonImportSummary;
};
