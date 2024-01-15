export enum ImportProblemKind {
  NO_IMPACT = 'NO_IMPACT',
  INVALID_FORMAT = 'INVALID_FORMAT',
  MISSING_ID_AND_NAME = 'MISSING_ID_AND_NAME',
  UNCONFIGURED_ID_AND_NAME = 'UNCONFIGURED_ID_AND_NAME',
  UNCONFIGURED_ID = 'UNCONFIGURED_ID',
  UNKNOWN_PERSON = 'UNKNOWN_PERSON',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  MAJOR_CHANGE = 'MAJOR_CHANGE',
}

export type ImportFieldProblem = {
  field: string;
  indices: number[];
  kind: ImportProblemKind.INVALID_FORMAT;
};

export type ImportFieldMetaProblem = {
  field: string;
  kind: ImportProblemKind.MAJOR_CHANGE;
};

export type ImportRowProblem = {
  indices: number[];
  kind:
    | ImportProblemKind.MISSING_ID_AND_NAME
    | ImportProblemKind.UNKNOWN_PERSON
    | ImportProblemKind.UNKNOWN_ERROR;
};

export type ImportSheetProblem = {
  kind:
    | ImportProblemKind.NO_IMPACT
    | ImportProblemKind.UNCONFIGURED_ID
    | ImportProblemKind.UNCONFIGURED_ID_AND_NAME;
};

export type ImportProblem =
  | ImportFieldProblem
  | ImportFieldMetaProblem
  | ImportRowProblem
  | ImportSheetProblem;
