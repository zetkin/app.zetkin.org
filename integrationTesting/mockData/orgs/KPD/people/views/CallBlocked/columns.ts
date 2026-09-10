import { COLUMN_TYPE } from 'features/views/components/types';
import { ZetkinViewColumn } from 'utils/types/zetkin';

const CallBlockedColumns: ZetkinViewColumn[] = [
  {
    config: { field: 'first_name' },
    id: 4,
    title: 'First name',
    type: COLUMN_TYPE.PERSON_FIELD,
  },
  {
    config: { field: 'last_name' },
    id: 5,
    title: 'Last name',
    type: COLUMN_TYPE.PERSON_FIELD,
  },
  {
    config: { state: 'any' },
    id: 6,
    title: 'Organizer action',
    type: COLUMN_TYPE.ORGANIZER_ACTION,
  },
];

export default CallBlockedColumns;
