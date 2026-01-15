import { ZetkinPerson } from 'utils/types/zetkin';

type PersonSetfieldsBulkOp = {
  data: Partial<ZetkinPerson>;
  op: 'person.setfields';
};

type PersonTagBulkOp = {
  op: 'person.tag';
  tag_id: number;
  value?: string | number | null;
};

type PersonAddtoorgBulkOp = {
  op: 'person.addtoorg';
  org_id: number;
};

type PersonDeleteBulkOp = {
  op: 'person.delete';
};

type PersonCreateBulkOp = {
  op: 'person.create';
  ops: BulkSubOp[];
};

type PersonGetBulkOp = {
  if_none?: 'create' | 'skip';
  key: { id: number } | { ext_id: string };
  op: 'person.get';
  ops: BulkSubOp[];
};

export type BulkSubOp =
  | PersonDeleteBulkOp
  | PersonSetfieldsBulkOp
  | PersonTagBulkOp
  | PersonAddtoorgBulkOp;

export type BulkOp = PersonCreateBulkOp | PersonGetBulkOp;
