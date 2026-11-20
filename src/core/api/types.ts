export interface ApiResponse<DataType> {
  data: DataType;
}

export interface ZetkinObjectAccess {
  level: 'configure' | 'edit' | 'readonly';
  person: {
    first_name: string;
    id: number;
    last_name: string;
  };
  updated: string;
  updated_by: {
    first_name: string;
    id: number;
    last_name: string;
  };
}

export type Api2FieldType =
  | 'int'
  | 'string'
  | 'boolean'
  | 'datetime'
  | (string & {});

export type Api2Field = {
  can_patch: boolean;
  can_post: boolean;
  nullable: boolean;
  type: Api2FieldType;
};

export type ApiFields<T extends object> = {
  [K in keyof T]-?: Api2Field;
};

export type Api2Pagination = {
  page: number;
  size: number;
  total: number;
};

export type Api2Meta<TData extends object | object[]> = {
  fields: ApiFields<TData extends Array<infer TItem> ? TItem & object : TData>;
  filters: string[];
  ordering: string[];
  pagination: TData extends readonly unknown[] ? Api2Pagination : never;
};

export type Api2Response<
  TData extends object | object[],
  TRelated extends object = Record<string, never>,
> = {
  data: TData;
  meta: Api2Meta<TData>;
  related: TRelated;
  success: boolean;
};
