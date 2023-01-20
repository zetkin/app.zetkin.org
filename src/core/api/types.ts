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
