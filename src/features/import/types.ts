import { ZetkinPerson } from 'utils/types/zetkin';

export type PersonSetfieldsBulkOp = {
  data: Partial<ZetkinPerson>;
  op: 'person.setfields';
};

export type PersonTagBulkOp = {
  op: 'person.tag';
  tag_id: number;
  value?: string | number | null;
};

export type PersonAddtoorgBulkOp = {
  op: 'person.addtoorg';
  org_id: number;
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
  | PersonSetfieldsBulkOp
  | PersonTagBulkOp
  | PersonAddtoorgBulkOp;

export type BulkOp = PersonCreateBulkOp | PersonGetBulkOp;
