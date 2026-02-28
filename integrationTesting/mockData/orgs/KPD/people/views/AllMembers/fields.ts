import { CUSTOM_FIELD_TYPE, ZetkinCustomField } from 'utils/types/zetkin';
import KPD from '../../..';

const AllCustomFields: ZetkinCustomField[] = [
  {
    description: 'Contains extra data as date',
    enum_choices: null,
    id: 1,
    org_read: 'sameorg',
    org_write: 'sameorg',
    organization: KPD,
    slug: 'extra_date',
    title: 'Extra date',
    type: CUSTOM_FIELD_TYPE.DATE,
  },
];

export default AllCustomFields;
