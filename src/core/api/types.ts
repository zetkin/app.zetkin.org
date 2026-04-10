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

export type Api2OrderingInfo = {
  dir: string;
  field: string;
};

export type Api2FieldInfo = {
  can_patch: boolean;
  can_post: boolean;
  nullable: boolean;
  type: string;
};

export type Api2FilterInfo = {
  active: boolean;
  kind: string;
  param: string;
  type: string;
};

export type Api2PaginationInfo = {
  page: number;
  size: number;
  total: number;
};

export type Api2ResponseMeta = {
  fields: Record<string, Api2FieldInfo>;
  filters: Api2FilterInfo[];
  ordering: Api2OrderingInfo[];
  pagination: Api2PaginationInfo;
};

export interface Api2Response<DataType> {
  data: DataType;
  success: boolean;
  meta: Api2ResponseMeta;
  related: Record<string, unknown>;
}
