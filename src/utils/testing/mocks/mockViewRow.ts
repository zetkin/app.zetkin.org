import { mockObject } from '.';
import { ZetkinViewRow } from 'features/views/components/types';

const viewRow: ZetkinViewRow = {
  id: 1,
  cells: {},
  added_by_user_id: null,
  added: null,
};

const mockViewRow = (overrides?: Partial<ZetkinViewRow>): ZetkinViewRow => {
  return mockObject<ZetkinViewRow>(viewRow, overrides);
};

export default mockViewRow;
