import { renderHook } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';

import { ZetkinEvent } from 'utils/types/zetkin';
import { ACTIVITIES, EventActivity } from '../models/CampaignActivitiesModel';
import useClusteredActivities, { CLUSTER_TYPE } from './useClusteredActivities';

const mockEventData: ZetkinEvent = {
  activity: {
    id: 1,
    title: 'Flyering',
  },
  campaign: {
    id: 1,
    title: 'My campaign',
  },
  contact: null,
  end_time: '1857-07-05T13:37:00.000Z',
  id: 1,
  info_text: '',
  location: {
    id: 1,
    lat: 0,
    lng: 0,
    title: 'Dorfplatz',
  },
  num_participants_available: 0,
  num_participants_required: 0,
  organization: {
    id: 1,
    title: 'KPD',
  },
  start_time: '1857-07-05T13:37:00.000Z',
};

function mockEvent(id: number, data: Partial<ZetkinEvent>): EventActivity {
  return {
    data: {
      ...mockEventData,
      ...data,
      id,
    },
    endDate: null,
    kind: ACTIVITIES.EVENT,
    startDate: null,
  };
}

describe('userClusteredActivities()', () => {
  it('does nothing with unrelated events on different days', () => {
    const { result } = renderHook(() =>
      useClusteredActivities([
        mockEvent(1, {
          end_time: '1857-07-01T13:00:00.000Z',
          start_time: '1857-07-01T12:00:00.000Z',
        }),
        mockEvent(2, {
          end_time: '1857-07-02T13:00:00.000Z',
          start_time: '1857-07-02T12:00:00.000Z',
        }),
        mockEvent(3, {
          end_time: '1857-07-03T13:00:00.000Z',
          start_time: '1857-07-03T12:00:00.000Z',
        }),
      ])
    );

    expect(result.current.length).toBe(3);
    expect(result.current[0].type).toBe(CLUSTER_TYPE.SINGLE);
    expect(result.current[0].events[0].id).toBe(1);
    expect(result.current[1].type).toBe(CLUSTER_TYPE.SINGLE);
    expect(result.current[1].events[0].id).toBe(2);
    expect(result.current[2].type).toBe(CLUSTER_TYPE.SINGLE);
    expect(result.current[2].events[0].id).toBe(3);
  });

  it('clusters three multi-shift events and leaves a third unrelated', () => {
    const { result } = renderHook(() =>
      useClusteredActivities([
        mockEvent(1, {
          end_time: '1857-07-05T13:00:00.000Z',
          start_time: '1857-07-05T12:00:00.000Z',
        }),
        mockEvent(2, {
          end_time: '1857-07-05T14:00:00.000Z',
          start_time: '1857-07-05T13:00:00.000Z',
        }),
        mockEvent(3, {
          end_time: '1857-07-05T15:00:00.000Z',
          start_time: '1857-07-05T14:00:00.000Z',
        }),
        mockEvent(4, {
          end_time: '1857-07-05T17:00:00.000Z',
          start_time: '1857-07-05T16:00:00.000Z',
        }),
      ])
    );

    expect(result.current.length).toBe(2);
    expect(result.current[0].type).toBe(CLUSTER_TYPE.MULTI_SHIFT);
    expect(result.current[0].events.length).toBe(3);
    expect(result.current[0].events[0].id).toBe(1);
    expect(result.current[0].events[1].id).toBe(2);
    expect(result.current[0].events[2].id).toBe(3);
    expect(result.current[1].type).toBe(CLUSTER_TYPE.SINGLE);
    expect(result.current[1].events.length).toBe(1);
    expect(result.current[1].events[0].id).toBe(4);
  });

  it('clusters two multi-shift events, but ignores events in different location', () => {
    const { result } = renderHook(() =>
      useClusteredActivities([
        mockEvent(1, {
          end_time: '1857-07-05T13:00:00.000Z',
          location: {
            id: 1,
            lat: 0,
            lng: 0,
            title: '',
          },
          start_time: '1857-07-05T12:00:00.000Z',
        }),
        mockEvent(2, {
          end_time: '1857-07-05T14:00:00.000Z',
          location: {
            id: 1,
            lat: 0,
            lng: 0,
            title: '',
          },
          start_time: '1857-07-05T13:00:00.000Z',
        }),
        mockEvent(3, {
          end_time: '1857-07-05T15:00:00.000Z',
          location: {
            id: 2, // <-- Different location
            lat: 0,
            lng: 0,
            title: '',
          },
          start_time: '1857-07-05T14:00:00.000Z',
        }),
      ])
    );

    expect(result.current.length).toBe(2);
    expect(result.current[0].type).toBe(CLUSTER_TYPE.MULTI_SHIFT);
    expect(result.current[0].events.length).toBe(2);
    expect(result.current[0].events[0].id).toBe(1);
    expect(result.current[0].events[1].id).toBe(2);
    expect(result.current[1].type).toBe(CLUSTER_TYPE.SINGLE);
    expect(result.current[1].events.length).toBe(1);
    expect(result.current[1].events[0].id).toBe(3);
  });
});
