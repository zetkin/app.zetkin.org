import dayjs from 'dayjs';
import { pick } from 'lodash';

import mockJourneyInstance from './mockJourneyInstance';
import mockNote from './mockNote';
import { mockObject } from 'utils/testing/mocks';
import mockPerson from './mockPerson';
import mockTag from './mockTag';
import { UPDATE_TYPES, ZetkinUpdate } from 'types/updates';

const update: Partial<ZetkinUpdate> = {
  actor: mockPerson(),
  organization: { id: 1, title: 'KPD' },
  timestamp: dayjs().subtract(5, 'hours').format(),
};

const mockUpdate = (
  type: `${UPDATE_TYPES}`,
  overrides?: Partial<ZetkinUpdate>
): ZetkinUpdate => {
  const updateData = {
    [UPDATE_TYPES.ANY_ADDTAGS]: {
      details: {
        tags: [mockTag()],
      },
      target: pick(mockJourneyInstance(), ['id', 'title']),
      type: 'journeyinstance.addtags',
    },
    [UPDATE_TYPES.ANY_REMOVETAGS]: {
      details: {
        tags: [mockTag()],
      },
      target: pick(mockJourneyInstance(), ['id', 'title']),
      type: 'journeyinstance.removetags',
    },
    [UPDATE_TYPES.JOURNEYINSTANCE_UPDATE]: {
      details: {
        changes: {
          summary: { from: 'Old summary', to: 'New summary' },
        },
      },
      target: pick(mockJourneyInstance(), ['id', 'title']),
      type: 'journeyinstance.update',
    },
    [UPDATE_TYPES.JOURNEYINSTANCE_ADDASSIGNEE]: {
      details: { assignee: mockPerson() },
      target: pick(mockJourneyInstance(), ['id', 'title']),
      type: 'journeyinstance.addassignee',
    },
    [UPDATE_TYPES.JOURNEYINSTANCE_ADDNOTE]: {
      details: { note: mockNote() },
      target: pick(mockJourneyInstance(), ['id', 'title']),
      type: 'journeyinstance.addnote',
    },
    [UPDATE_TYPES.JOURNEYINSTANCE_CLOSE]: {
      details: { outcome: '' },
      target: pick(mockJourneyInstance(), ['id', 'title']),
      type: 'journeyinstance.close',
    },
    [UPDATE_TYPES.JOURNEYINSTANCE_CREATE]: {
      details: { data: mockJourneyInstance() },
      target: mockJourneyInstance(),
      type: 'journeyinstance.create',
    },
    [UPDATE_TYPES.JOURNEYINSTANCE_OPEN]: {
      details: {},
      target: pick(mockJourneyInstance(), ['id', 'title']),
      type: 'journeyinstance.open',
    },
    [UPDATE_TYPES.JOURNEYINSTANCE_REMOVEASSIGNEE]: {
      details: { assignee: mockPerson() },
      target: pick(mockJourneyInstance(), ['id', 'title']),
      type: 'journeyinstance.removeassignee',
    },
    [UPDATE_TYPES.JOURNEYINSTANCE_UPDATEMILESTONE]: {
      details: {
        changes: {
          completed: { from: null, to: update.timestamp },
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
