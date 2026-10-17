export type ListAccessLevel = 'configure' | 'edit' | 'readonly';

// Access to an object (e.g. a list) as granted to a user in api2.
export interface Zetkin2ListAccess {
  granted: string;
  granted_by_user_id: number | null;
  id: number;
  level: ListAccessLevel;
  user_id: number;
}
