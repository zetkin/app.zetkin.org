import dayjs from 'dayjs';

import { mockObject } from 'utils/testing/mocks';
import mockPerson from './mockPerson';
import { ZetkinUpdate } from 'types/zetkin';

const update: ZetkinUpdate = {
  actor: mockPerson(),
  created_at: dayjs().subtract(5, 'hours').format(),
  details: { assignee: mockPerson() },
  target: { id: 1, title: 'Journey instance' },
  type: 'journeyInstance.assignee.add',
};

const mockUpdate = (overrides?: Partial<ZetkinUpdate>): ZetkinUpdate => {
  return mockObject(update, overrides);
};

export default mockUpdate;

export { update };
