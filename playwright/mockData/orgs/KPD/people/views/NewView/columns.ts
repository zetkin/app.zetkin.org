import { ZetkinViewColumn } from '../../../../../../../src/types/zetkin';

const NewViewColumns: ZetkinViewColumn[] = [
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
];

export default NewViewColumns;
