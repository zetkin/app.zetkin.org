import { Gender } from '../hooks/useGenderMapping';
import { BulkOp } from '../types';

export type CellData = string | number | null | undefined;

export type ImportedFile = {
  selectedSheetIndex: number;
  sheets: Sheet[];
  title: string;
};

export type Sheet = {
  columns: Column[];
  firstRowIsHeaders: boolean;
  rows: Row[];
  skipUnknown?: boolean;
  title: string;
};

export type SheetSettings = Omit<Sheet, 'columns' | 'rows' | 'title'>;

export type Row = {
  data: CellData[];
};

export enum ColumnKind {
  FIELD = 'field',
  GENDER = 'gender',
  DATE = 'date',
  ID_FIELD = 'id',
  TAG = 'tag',
  ORGANIZATION = 'org',
  ENUM = 'enum',
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

export type DateColumn = BaseColumn & {
  dateFormat: string | null;
  field: string;
  kind: ColumnKind.DATE;
};

export type GenderColumn = BaseColumn & {
  field: string;
  kind: ColumnKind.GENDER;
  mapping: {
    gender: Gender | null;
    value: CellData;
  }[];
};

export type EnumColumn = BaseColumn & {
  field: string;
  kind: ColumnKind.ENUM;
  mapping: {
    key: string;
    value: CellData;
  }[];
};

export type ImportID = 'ext_id' | 'id' | 'email' | null;

export type IDFieldColumn = BaseColumn & {
  idField: ImportID;
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

export type ConfigurableColumn =
  | DateColumn
  | IDFieldColumn
  | TagColumn
  | OrgColumn
  | GenderColumn
  | EnumColumn;

export type Column = UnknownColumn | FieldColumn | ConfigurableColumn;

export interface ZetkinPersonImportPostBody {
  ops: BulkOp[];
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
    byChangedField: { [key: string]: number };
    byInitializedField: { [key: string]: number };
    total: number;
  };
};

type BulkReport = {
  person: {
    summary: PersonImportSummary;
  };
};

type CompletedLogItem = {
  accepted: string;
  completed: string;
  report: BulkReport;
  status: 'completed';
};

type ErrorBulkLogItem = {
  accepted: string;
  completed: string;
  report: BulkReport;
  status: 'error';
};

type InProgressLogItem = {
  accepted: string;
  completed: null;
  report: null;
  status: 'in_progress';
};

type PendingBulkLogItem = {
  accepted: string;
  completed: null;
  report: null;
  status: 'pending';
};

export type PersonImport =
  | CompletedLogItem
  | ErrorBulkLogItem
  | InProgressLogItem
  | PendingBulkLogItem;

export enum ImportPreviewProblemCode {
  INVALID_FORMAT = 'INVALID_FORMAT',
  MISSING_ID_AND_NAME = 'MISSING_ID_AND_NAME',
  UNEXPECTED_ERROR = 'UNEXPECTED_ERROR',
  UNKNOWN = 'UNKNOWN',
  UNKNOWN_ORG = 'UNKNOWN_ORG',
  UNKNOWN_OBJECT = 'UNKNOWN_OBJECT',
  UNKNOWN_FIELD = 'UNKNOWN_FIELD',
}

type ImportPreviewProblem = {
  code: ImportPreviewProblemCode;
  field?: string;
  index: number;
  level: 'error' | 'warning';
};

export type ImportPreview = {
  problems: ImportPreviewProblem[];
  stats: BulkReport;
};
