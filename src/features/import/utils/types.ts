export type CellData = string | number | null;

export type ImportedFile = {
  selectedSheetIndex: number;
  sheets: Sheet[];
  title: string;
};

export type Sheet = {
  columns: Column[];
  currentlyConfiguring: number | null;
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

interface BasicColumn {
  data: CellData[];
  selectedField?: Field;
  id: number;
  selected: boolean;
  title: string;
}

interface ValueMapping {
  tagId: number;
  value: CellData;
}

type TagColumn = BasicColumn & {
  valueMapping: ValueMapping[];
};

export type Column = BasicColumn | TagColumn;

export interface MappingResults {
  numMappedTo: number;
  numPeople: number;
}
