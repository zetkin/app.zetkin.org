import {
  BulkSubOp,
  PersonAddtoorgBulkOp,
  PersonSetfieldsBulkOp,
  PersonTagBulkOp,
} from 'features/import/types';

export type PendingSubOp<SubOp extends BulkSubOp> = {
  config: SubOp | null;
  opType: SubOp['op'];
};

export type AnyPendingSubOp =
  | PendingSubOp<PersonAddtoorgBulkOp>
  | PendingSubOp<PersonSetfieldsBulkOp>
  | PendingSubOp<PersonTagBulkOp>;
