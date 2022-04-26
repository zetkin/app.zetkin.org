import dayjs from 'dayjs';

import { mockObject } from 'utils/testing/mocks';
import mockPerson from './mockPerson';
import { UPDATE_TYPES, ZetkinUpdate } from 'types/updates';

const update: ZetkinUpdate = {
  actor: mockPerson(),
  created_at: dayjs().subtract(5, 'hours').format(),
  type: 'journeyinstance.addassignee',
};

const mockUpdate = (
  type: `${UPDATE_TYPES}`,
  overrides?: Partial<ZetkinUpdate>
): ZetkinUpdate => {
  const updateData = {
    [UPDATE_TYPES.JOURNEYINSTANCE_ADDASSIGNEE]: {
      details: { assignee: mockPerson() },
      target: { id: 1, title: 'Journey instance' },
    },
    [UPDATE_TYPES.JOURNEYINSTANCE_UPDATEMILESTONE]: {},
  };

  return {
    ...mockObject(update, overrides),
    ...updateData[type],
  };
};

export default mockUpdate;

export { update };
