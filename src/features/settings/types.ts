import { ZetkinCustomField } from 'utils/types/zetkin';

export type CustomFieldPostBody = Pick<
  ZetkinCustomField,
  'title' | 'type' | 'slug' | 'enum_choices'
>;

export type CustomFieldPatchBody = Partial<
  Omit<ZetkinCustomField, 'id' | 'organization'>
>;

export enum AccessType {
  ONLY_THIS_ORG = 'onlyThisOrg',
  SUBORG_READ = 'suborgRead',
  SUBORG_READ_AND_WRITE = 'suborgReadAndWrite',
}
