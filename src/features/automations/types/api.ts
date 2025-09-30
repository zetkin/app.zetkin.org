import { BulkSubOp } from 'features/import/types';

export type ZetkinBulkAutomation = {
  active: boolean;
  bulk_ops: BulkSubOp[];
  created: string;
  created_by_user_id: number;
  description: string;
  id: number;
  last_run: string | null;
  organization_id: number;
  query_id: number;
  schedule: {
    interval: number;
  };
  title: string;
};

export type ZetkinBulkAutomationPostBody = Partial<
  Pick<ZetkinBulkAutomation, 'bulk_ops' | 'description' | 'schedule' | 'title'>
>;

export type ZetkinBulkAutomationPatchBody = Partial<
  Pick<
    ZetkinBulkAutomation,
    'active' | 'bulk_ops' | 'description' | 'schedule' | 'title'
  >
>;
