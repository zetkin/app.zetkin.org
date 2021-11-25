import { COLUMN_TYPE } from 'types/views';
import { ZetkinViewColumn } from '../../../../../../../src/types/zetkin';

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
