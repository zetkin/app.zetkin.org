import { ZetkinPersonImportOp } from './prepareImportOperations';

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
    tags: { id: number }[];
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
  ID_MISSING = 'idMissing',
  ID = 'id',
  ID_VALUE_MISSING = 'idValueMissing',
  NOT_SELECTED_ID_TYPE = 'notSelectedIdType',
  PHONE = 'phone',
  ALT_PHONE = 'altPhone',
  POST_CODE = 'postCode',
  NO_IDENTIFIER = 'noIdentifier',
  URL = 'url',
}

export interface ZetkinPersonImportPostBody {
  ops: ZetkinPersonImportOp[];
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

type ImportStatus = 'completed' | 'error' | 'pending' | 'in_progress';

export type PersonImport = {
  accepted: string;
  completed: string | null;
  report: {
    person: {
      summary: PersonImportSummary;
    };
  };
  status: ImportStatus | null;
};

export type ImportPreview = {
  stats: PersonImport['report'];
};
