import { mockObject } from '.';
import { ZetkinViewRow } from 'types/views';

const viewRow: ZetkinViewRow = {
  content: [],
  id: 1,
};

const mockViewRow = (overrides?: Partial<ZetkinViewRow>): ZetkinViewRow => {
  return mockObject<ZetkinViewRow>(viewRow, overrides);
};

export default mockViewRow;
