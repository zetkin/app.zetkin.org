import { COLUMN_TYPE } from 'features/views/components/types';
import { ZetkinViewColumn } from 'utils/types/zetkin';

const AllMembersColumns: ZetkinViewColumn[] = [
  {
    config: { field: 'first_name' },
    id: 1,
    title: 'First name',
    type: COLUMN_TYPE.PERSON_FIELD,
  },
  {
    config: { field: 'last_name' },
    id: 2,
    title: 'Last name',
    type: COLUMN_TYPE.PERSON_FIELD,
  },
  {
    id: 3,
    title: 'Active',
    type: COLUMN_TYPE.LOCAL_BOOL,
  },
];

export default AllMembersColumns;
