import dayjs from 'dayjs';
import { pick } from 'lodash';

import mockJourneyInstance from './mockJourneyInstance';
import { mockObject } from 'utils/testing/mocks';
import mockPerson from './mockPerson';
import { UPDATE_TYPES, ZetkinUpdate } from 'types/updates';

const update: Partial<ZetkinUpdate> = {
  actor: mockPerson(),
  created_at: dayjs().subtract(5, 'hours').format(),
};

const mockUpdate = (
  type: `${UPDATE_TYPES}`,
  overrides?: Partial<ZetkinUpdate>
): ZetkinUpdate => {
  const updateData = {
    [UPDATE_TYPES.JOURNEYINSTANCE_ADDASSIGNEE]: {
      details: { assignee: mockPerson() },
      target: pick(mockJourneyInstance(), ['id', 'title']),
      type: 'journeyinstance.addassignee',
    },
    [UPDATE_TYPES.JOURNEYINSTANCE_UPDATEMILESTONE]: {
      details: {
        changes: {
          completed: { from: null, to: update.created_at },
        },
        milestone: {
          id: 1,
          title: 'title of milestone',
        },
      },
      target: pick(mockJourneyInstance(), ['id', 'title']),
      type: 'journeyinstance.updatemilestone',
    },
  };

  return {
    ...mockObject(update, overrides),
    ...updateData[type],
  } as ZetkinUpdate;
};

export default mockUpdate;

export { update };
