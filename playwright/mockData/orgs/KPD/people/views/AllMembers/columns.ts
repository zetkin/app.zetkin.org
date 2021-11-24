import { ZetkinViewColumn } from '../../../../../../../src/types/zetkin';

const AllMembersColumns: ZetkinViewColumn[] = [
    {
        config: { field: 'first_name' },
        id: 1,
        title: 'First name',
        type: 'person_field',
    },
    {
        config: { field: 'last_name' },
        id: 2,
        title: 'Last name',
        type: 'person_field',
    },
    {
        config: { field: 'active' },
        id: 3,
        title: 'Active',
        type: 'local_bool',
    },
];

export default AllMembersColumns;
