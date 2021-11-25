import { COLUMN_TYPE } from 'types/views';
import { ZetkinViewColumn } from '../../../../../../../src/types/zetkin';

const NewViewColumns: ZetkinViewColumn[] = [
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
];

export default NewViewColumns;
