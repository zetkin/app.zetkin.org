import { ZetkinCustomField } from 'utils/types/zetkin';

export type CustomFieldPostBody = Pick<
  ZetkinCustomField,
  'title' | 'type' | 'slug' | 'enum_choices'
>;

export type CustomFieldPatchBody = Partial<
  Omit<ZetkinCustomField, 'id' | 'organization'>
>;
