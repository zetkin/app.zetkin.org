import { BulkSubOp } from 'features/import/types';

export type ZetkinBulkAutomation = {
  active: boolean;
  bulk_ops: BulkSubOp[];
  created: string;
  created_by_user_id: number;
  description: string;
  id: number;
  last_run: string;
  organization_id: number;
  title: string;
};
