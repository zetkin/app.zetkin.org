export interface ApiResponse<DataType> {
  data: DataType;
}

export type ListAccessLevel = 'configure' | 'edit' | 'readonly';

// Access to an object (e.g. a list) as granted to a user in core2.
export interface ZetkinListAccess {
  granted: string;
  granted_by_user_id: number | null;
  id: number;
  level: ListAccessLevel;
  user_id: number;
}
